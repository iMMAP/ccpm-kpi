from django.db import models
from django.db import transaction
from shortuuid import ShortUUID
from jsonfield import JSONField
from taggit.managers import TaggableManager
from taggit.models import Tag
import reversion
import json
import copy
from object_permission import ObjectPermission, perm_parse
from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
import re

SURVEY_ASSET_TYPES = [
    ('text', 'text'),
    ('survey_block', 'survey_block'),
    ('choice_list', 'choice list'),
]
SURVEY_ASSET_UID_LENGTH = 22

class SurveyAssetManager(models.Manager):
    def filter_by_tag_name(self, tag_name):
        try:
            tag = Tag.objects.get(name=tag_name)
        except Tag.DoesNotExist, e:
            return self.none()
        return self.filter(tags=tag)


@reversion.register
class SurveyAsset(models.Model):
    name = models.CharField(max_length=255, blank=True, default='')
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    content = JSONField(null=True)
    asset_type = models.CharField(choices=SURVEY_ASSET_TYPES, max_length=20, default='text')
    collection = models.ForeignKey('Collection', related_name='survey_assets', null=True)
    owner = models.ForeignKey('auth.User', related_name='survey_assets', null=True)
    editors_can_change_permissions = models.BooleanField(default=True)
    uid = models.CharField(max_length=SURVEY_ASSET_UID_LENGTH, default='')
    tags = TaggableManager()

    objects = SurveyAssetManager()

    class Meta:
        ordering = ('date_created',)
        permissions = (
            # change_surveyasset and delete_surveyasset are provided
            # automatically by Django
            ('view_surveyasset', 'Can view survey asset'),
            ('share_surveyasset', "Can change this survey asset's sharing settings"),
        )

    def versions(self):
        return reversion.get_for_object(self)

    def versioned_data(self):
        return [v.field_dict for v in self.versions()]

    def to_ss_structure(self):
        return self.content

    def _populate_uid(self):
        if self.uid == '':
            self.uid = self._generate_uid()

    def _generate_uid(self):
        return 'a' + ShortUUID().random(SURVEY_ASSET_UID_LENGTH-1)

    def save(self, *args, **kwargs):
        # populate uid field if it's empty
        self._populate_uid()
        with transaction.atomic(), reversion.create_revision():
            super(SurveyAsset, self).save(*args, **kwargs)
        # Apply the owner's implicit permissions
        self._recalculate_inherited_perms()

    def _recalculate_inherited_perms(self):
        ''' Copy all of our parent's effective permissions to ourself,
        marking the copies as inherited permissions. The owner's rights are
        also made explicit as "inherited" permissions. '''
        # Start with a clean slate
        ObjectPermission.objects.filter_for_object(
            self,
            inherited=True
        ).delete()
        # Is there anything to inherit?
        if self.collection is not None:
            # All our parent's effective permissions become our inherited
            # permissions.
            mangle_perm = lambda x: re.sub('_collection$', '_surveyasset', x)
            # Store translations in a dictionary here to minimize invocations of
            # the Django machinery
            translate_perm = {}
            for user_id, permission_id in self.collection._effective_perms():
                try:
                    translated_id = translate_perm[permission_id]
                except KeyError:
                    collection_perm = Permission.objects.get(
                        pk=permission_id)
                    translated_id = Permission.objects.get(
                        content_type__app_label=\
                            collection_perm.content_type.app_label,
                        codename=mangle_perm(collection_perm.codename)
                    ).pk
                    translate_perm[permission_id] = translated_id
                ObjectPermission.objects.create(
                    content_object=self,
                    user_id=user_id,
                    permission_id=translated_id,
                    inherited=True
                )
        # The owner (if there is one!) gets every possible permission
        if self.owner is None:
            return
        content_type = ContentType.objects.get_for_model(self)
        for perm in Permission.objects.filter(content_type=content_type):
            # Use get_or_create in case the owner already has permissions
            ObjectPermission.objects.get_or_create_for_object(
                self,
                user=self.owner,
                permission=perm,
                inherited=True
            )

    def _effective_perms(self, **kwargs):
        ''' Reconcile all grant and deny permissions, and return an
        authoritative set of grant permissions (i.e. deny=False) for the
        current survey asset. '''
        grant_perms = set(ObjectPermission.objects.filter_for_object(self,
            deny=False, **kwargs).values_list('user_id', 'permission_id'))
        deny_perms = set(ObjectPermission.objects.filter_for_object(self,
            deny=True, **kwargs).values_list('user_id', 'permission_id'))
        return grant_perms.difference(deny_perms)

    def has_perm(self, user_obj, perm):
        ''' Does user_obj have perm on this survey asset? (True/False) '''
        app_label, codename = perm_parse(perm, self)
        return len(self._effective_perms(
            user_id=user_obj.pk,
            permission__codename=codename
        )) == 1

    def assign_perm(self, user_obj, perm, deny=False, defer_recalc=False):
        ''' Assign user_obj the given perm on this survey asset. To break
        inheritance from a parent collection, use deny=True. '''
        app_label, codename = perm_parse(perm, self)
        perm_model = Permission.objects.get(
            content_type__app_label=app_label,
            codename=codename
        )
        existing_perms = ObjectPermission.objects.filter_for_object(
            self,
            user=user_obj,
        )
        if existing_perms.filter(
            inherited=False,
            permission_id=perm_model.pk,
            deny=deny,
        ):
            # The user already has this permission directly applied
            return
        # Remove any explicitly-defined contradictory grants or denials
        existing_perms.filter(user=user_obj,
            permission_id=perm_model.pk,
            deny=not deny,
            inherited=False
        ).delete()
        # Create the new permission
        ObjectPermission.objects.create(
            content_object=self,
            user=user_obj,
            permission_id=perm_model.pk,
            deny=deny,
            inherited=False
        )
        # Granting change implies granting view
        if codename.startswith('change_') and not deny:
            change_codename = re.sub('^change_', 'view_', codename)
            self.assign_perm(user_obj, change_codename, defer_recalc=True)
        # Denying view implies denying change
        if deny and codename.startswith('view_'):
            change_codename = re.sub('^view_', 'change_', codename)
            self.assign_perm(user_obj, change_codename,
                             deny=True, defer_recalc=True)
        # We might have been called by ourself to assign a related
        # permission. In that case, don't recalculate here.
        if defer_recalc:
            return
        self._recalculate_inherited_perms()

    def remove_perm(self, user_obj, perm, deny=False):
        ''' Revoke perm on this collection from user_obj. '''
        app_label, codename = perm_parse(perm, self)
        ObjectPermission.objects.filter_for_object(
            self,
            user=user_obj,
            permission__codename=codename,
            deny=deny,
            inherited=False
        ).delete()
        self._recalculate_inherited_perms()

    def get_perms(self, user_obj):
        ''' Return a list of codenames of all effective grant permissions that
        user_obj has on this survey asset. '''
        user_perm_ids = self._effective_perms(user=user_obj)
        perm_ids = [x[1] for x in user_perm_ids]
        return Permission.objects.filter(pk__in=perm_ids).values_list(
            'codename', flat=True)

    def get_users_with_perms(self, attach_perms=False):
        ''' Return a QuerySet of all users with any effective grant permission
        on this survey asset. If attach_perms=True, then return a dict with
        users as the keys and lists of their permissions as the values. '''
        user_perm_ids = self._effective_perms()
        if attach_perms:
            user_perm_dict = {}
            for user_id, perm_id in user_perm_ids:
                perm_list = user_perm_dict.get(user_id, [])
                perm_list.append(Permission.objects.get(pk=perm_id).codename)
                user_perm_dict[user_id] = perm_list
            # Resolve user ids into actual user objects
            user_perm_dict = {User.objects.get(pk=key): value for (key, value)
                in user_perm_dict.iteritems()}
            return user_perm_dict
        else:
            # Use a set to avoid duplicate users
            user_ids = {x[0] for x in user_perm_ids}
            return User.objects.filter(pk__in=user_ids)

    @property
    def export(self):
        version_id = reversion.get_for_object(self).last().id
        # SurveyAssetExport.objects.filter(survey_asset=self).delete()
        (model, created,) = SurveyAssetExport.objects.get_or_create(survey_asset=self,
                                survey_asset_version_id=version_id)
        return model

class SurveyAssetExport(models.Model):
    '''
    This model serves as a cache of the XML that was exported by the installed
    version of pyxform.

    If the database gets heavy, we will want to clear this out.
    '''
    xml = models.TextField()
    source = JSONField(default='{}')
    details = JSONField(default='{}')
    survey_asset = models.ForeignKey(SurveyAsset)
    survey_asset_version_id = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)

    def generate_xml_from_source(self):
        import pyxform
        import tempfile
        summary = {}
        warnings = []
        default_name = None
        default_language = u'default'
        try:
            dict_repr = pyxform.xls2json.workbook_to_json(self.source, default_name, default_language, warnings)
            dict_repr[u'name'] = dict_repr[u'id_string']
            survey = pyxform.builder.create_survey_element_from_dict(dict_repr)
            with tempfile.NamedTemporaryFile(suffix='.xml') as named_tmp:
                survey.print_xform_to_file(path=named_tmp.name, validate=True, warnings=warnings)
                named_tmp.seek(0)
                self.xml = named_tmp.read()
            summary.update({
                u'default_name': default_name,
                u'default_language': default_language,
                u'warnings': warnings,
                })
            summary['status'] = 'success'
        except Exception, e:
            summary.update({
                u'error': unicode(e),
                u'warnings': warnings,
            })

    def save(self, *args, **kwargs):
        version = reversion.get_for_object(self.survey_asset).get(id=self.survey_asset_version_id)
        survey_asset = version.object
        self.source = survey_asset.to_ss_structure()
        self.generate_xml_from_source()
        return super(SurveyAssetExport, self).save(*args, **kwargs)