import React from 'react';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import autoBind from 'react-autobind';
import Reflux from 'reflux';
import alertify from 'alertifyjs';
import Select from 'react-select';
import Dropzone from 'react-dropzone';
import TextBox from 'js/components/textBox';
import Checkbox from 'js/components/checkbox';
import {bem} from 'js/bem';
import TextareaAutosize from 'react-autosize-textarea';
import {stores} from 'js/stores';
import {hashHistory} from 'react-router';
import mixins from 'js/mixins';
import TemplatesList from 'js/components/templatesList';
import {actions} from 'js/actions';
import {dataInterface} from 'js/dataInterface';
import {removeInvalidChars} from 'js/assetUtils';
import {
  validFileTypes,
  isAValidUrl,
  escapeHtml
} from 'utils';
import {
  NAME_MAX_LENGTH,
  PROJECT_SETTINGS_CONTEXTS
} from 'js/constants';

const VIA_URL_SUPPORT_URL = 'xls_url.html';

/*
This is used for multiple different purposes:

1. When creating new project
2. When replacing project with new one
3. When editing project in /settings
4. When editing or creating asset in Form Builder

Identifying the purpose is done by checking `context` and `formAsset`.

You can listen to field changes by `onProjectDetailsChange` prop function.
*/
class ProjectSettings extends React.Component {
  constructor(props) {
    super(props);

    this.STEPS = {
      FORM_SOURCE: 'form-source',
      CHOOSE_TEMPLATE: 'choose-template',
      UPLOAD_FILE: 'upload-file',
      IMPORT_URL: 'import-url',
      PROJECT_DETAILS: 'project-details'
    };

    this.unlisteners = [];

    const formAsset = this.props.formAsset;
    
    const ccpmData = formAsset && formAsset.settings.ccpmData ? JSON.parse(formAsset.settings.ccpmData): {};


    this.state = {
      isSessionLoaded: !!stores.session.currentAccount,
      isSubmitPending: false,
      formAsset: formAsset,
      // project details
      name: formAsset ? formAsset.name : '',
      description: formAsset ? formAsset.settings.description : '',
      sector: formAsset ? formAsset.settings.sector : null,
      country: formAsset ? formAsset.settings.country : null,
      'share-metadata': formAsset ? formAsset.settings['share-metadata'] : false,
      // steps
      currentStep: null,
      previousStep: null,
      // importing url
      isImportFromURLPending: false,
      importUrl: '',
      importUrlButtonEnabled: false,
      importUrlButton: t('Import'),
      // template
      isApplyTemplatePending: false,
      applyTemplateButton: t('Next'),
      chosenTemplateUid: null,
      // upload files
      isUploadFilePending: false,
      // archive flow
      isAwaitingArchiveCompleted: false,
      isAwaitingUnarchiveCompleted: false,
      // CCPM project details
      ccpmYear: ccpmData.year ? ccpmData.year.toString() : new Date().getFullYear().toString(),
      ccpmRegion: ccpmData.region || null,
      ccpmCluster: ccpmData.cluster || '',
      ccpmAddSubCluster: ccpmData.addSubCluster || false,
      ccpmSubCluster: ccpmData.subCluster || ''
    };

    autoBind(this);
  }

  /*
   * setup
   */

  componentDidMount() {
    this.setInitialStep();
    this.listenTo(stores.session, () => {
      this.setState({
        isSessionLoaded: true,
      });
    });
    this.unlisteners.push(
      actions.resources.updateAsset.completed.listen(this.onUpdateAssetCompleted.bind(this)),
      actions.resources.updateAsset.failed.listen(this.onUpdateAssetFailed.bind(this)),
      actions.resources.cloneAsset.completed.listen(this.onCloneAssetCompleted.bind(this)),
      actions.resources.cloneAsset.failed.listen(this.onCloneAssetFailed.bind(this)),
      actions.resources.setDeploymentActive.failed.listen(this.onSetDeploymentActiveFailed.bind(this)),
      actions.resources.setDeploymentActive.completed.listen(this.onSetDeploymentActiveCompleted.bind(this)),
      hashHistory.listen(this.onRouteChange.bind(this))
    );
  }

  componentWillUnmount() {
    this.unlisteners.forEach((clb) => {clb();});
  }

  setInitialStep() {
    switch (this.props.context) {
      case PROJECT_SETTINGS_CONTEXTS.NEW:
        return this.displayStep(this.STEPS.CHOOSE_TEMPLATE);
      case PROJECT_SETTINGS_CONTEXTS.REPLACE:
        return this.displayStep(this.STEPS.FORM_SOURCE);
      case PROJECT_SETTINGS_CONTEXTS.EXISTING:
      case PROJECT_SETTINGS_CONTEXTS.BUILDER:
        return this.displayStep(this.STEPS.PROJECT_DETAILS);
      default:
        throw new Error(`Unknown context: ${this.props.context}!`);
    }
  }

  getBaseTitle() {
    switch (this.props.context) {
      case PROJECT_SETTINGS_CONTEXTS.NEW:
        return t('New CCPM');
      case PROJECT_SETTINGS_CONTEXTS.REPLACE:
        return t('Replace form');
      case PROJECT_SETTINGS_CONTEXTS.EXISTING:
      case PROJECT_SETTINGS_CONTEXTS.BUILDER:
      default:
        return t('CCPM settings');
    }
  }

  getStepTitle(step) {
    switch (step) {
      case this.STEPS.FORM_SOURCE: return t('Choose a source');
      case this.STEPS.CHOOSE_TEMPLATE: return t('Choose template');
      case this.STEPS.UPLOAD_FILE: return t('Upload XLSForm');
      case this.STEPS.IMPORT_URL: return t('Import XLSForm');
      case this.STEPS.PROJECT_DETAILS: return t('CCPM details');
      default: return '';
    }
  }

  getFilenameFromURI(url) {
    return decodeURIComponent(new URL(url).pathname.split('/').pop().split('.')[0]);
  }

  /*
   * handling user input
   */

  onAnyDataChange(fieldName, fieldValue) {
    if (typeof this.props.onProjectDetailsChange === 'function') {
      this.props.onProjectDetailsChange({fieldName, fieldValue});
    }
  }

  onNameChange(evt) {
    this.setState({name: removeInvalidChars(evt.target.value)});
    this.onAnyDataChange('name', removeInvalidChars(evt.target.value));
  }

  onDescriptionChange(evt) {
    this.setState({description: removeInvalidChars(evt.target.value)});
    this.onAnyDataChange('description', removeInvalidChars(evt.target.value));
  }

  onCountryChange(val) {
    this.setState({country: val});
    this.onAnyDataChange('country', val);
  }

  onSectorChange(val) {
    this.setState({sector: val});
    this.onAnyDataChange('sector', val);
  }

  onShareMetadataChange(isChecked) {
    this.setState({'share-metadata': isChecked});
    this.onAnyDataChange('share-metadata', isChecked);
  }

  onCCPMYearChange(evt) {
    this.setState({ccpmYear: evt.target.value});
    this.onAnyDataChange('ccpmYear', removeInvalidChars(evt.target.value));
  }

  onCCPMRegionChange(val) {
    this.setState({ccpmRegion: val});
    this.onAnyDataChange('ccpmRegion', val);
  }

  onCCPMClusterChange(evt) {
    this.setState({ccpmCluster: evt.target.value});
    this.onAnyDataChange('ccpmCluster', removeInvalidChars(evt.target.value));
  }

  onCCPMAddSubClusterChange(isChecked) {
    this.setState({ccpmAddSubCluster: isChecked});
    this.onAnyDataChange('ccpmAddSubCluster', isChecked);
  }

  onCCPMSubClusterChange(evt) {
    this.setState({ccpmSubCluster: evt.target.value});
    this.onAnyDataChange('ccpmSubCluster', removeInvalidChars(evt.target.value));
  }

  onImportUrlChange(value) {
    this.setState({
      importUrl: value,
      importUrlButtonEnabled: isAValidUrl(value),
      importUrlButton: t('Import')
    });
  }

  onTemplateChange(templateUid) {
    this.setState({
      chosenTemplateUid: templateUid
    });
  }

  resetApplyTemplateButton() {
    this.setState({
      isApplyTemplatePending: false,
      applyTemplateButton: t('Choose')
    });
  }

  resetImportUrlButton() {
    this.setState({
      isImportFromURLPending: false,
      importUrlButtonEnabled: false,
      importUrlButton: t('Import'),
    });
  }

  deleteProject() {
    this.deleteAsset(
      this.state.formAsset.uid,
      this.state.formAsset.name,
      this.goToProjectsList.bind(this)
    );
  }

  // archive flow

  isArchived() {
    return this.state.formAsset.has_deployment && !this.state.formAsset.deployment__active;
  }

  archiveProject() {
    this.archiveAsset(this.state.formAsset.uid, this.onArchiveProjectStarted.bind(this));
  }

  onArchiveProjectStarted() {
    this.setState({isAwaitingArchiveCompleted: true});
  }

  unarchiveProject() {
    this.unarchiveAsset(this.state.formAsset.uid, this.onUnarchiveProjectStarted.bind(this));
  }

  onUnarchiveProjectStarted() {
    this.setState({isAwaitingUnarchiveCompleted: true});
  }

  onSetDeploymentActiveFailed() {
    this.setState({
      isAwaitingArchiveCompleted: false,
      isAwaitingUnarchiveCompleted: false
    });
  }

  // when archiving/unarchiving finishes, take user to a route that makes sense
  // unless user navigates by themselves before that happens
  onSetDeploymentActiveCompleted() {
    if (this.state.isAwaitingArchiveCompleted) {
      this.goToProjectsList();
    }
    if (this.state.isAwaitingUnarchiveCompleted) {
      this.goToFormLanding();
    }
    this.setState({
      isAwaitingArchiveCompleted: false,
      isAwaitingUnarchiveCompleted: false
    });
  }

  onRouteChange() {
    this.setState({
      isAwaitingArchiveCompleted: false,
      isAwaitingUnarchiveCompleted: false
    });
  }

  /*
   * routes navigation
   */

  goToFormBuilder(assetUid) {
    stores.pageState.hideModal();
    hashHistory.push(`/forms/${assetUid}/edit`);
  }

  goToFormLanding() {
    stores.pageState.hideModal();

    let targetUid;
    if (this.state.formAsset) {
      targetUid = this.state.formAsset.uid;
    } else if (this.context.router && this.context.router.params.assetid) {
      targetUid = this.context.router.params.assetid;
    }

    if (!targetUid) {
      throw new Error('Unknown uid!');
    }

    hashHistory.push(`/forms/${targetUid}/landing`);
  }

  goToProjectsList() {
    stores.pageState.hideModal();
    hashHistory.push('/forms/');
  }

  /*
   * modal steps navigation
   */

  displayStep(targetStep) {
    const currentStep = this.state.currentStep;
    const previousStep = this.state.previousStep;

    if (targetStep === currentStep) {
      return;
    } else if (targetStep === previousStep) {
      this.setState({
        currentStep: previousStep,
        previousStep: null
      });
    } else {
      this.setState({
        currentStep: targetStep,
        previousStep: currentStep
      });
    }

    if (this.props.onSetModalTitle) {
      const stepTitle = this.getStepTitle(targetStep);
      const baseTitle = this.getBaseTitle();
      this.props.onSetModalTitle(`${baseTitle}: ${stepTitle}`);
    }
  }

  displayPreviousStep() {
    if (this.state.previousStep) {
      this.displayStep(this.state.previousStep);
    }
  }

  /*
   * handling asset creation
   */

  onUpdateAssetCompleted() {
    if (
      this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE ||
      this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW
    ) {
      this.goToFormLanding();
    }
  }

  onUpdateAssetFailed() {
    if (
      this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE ||
      this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW
    ) {
      this.resetApplyTemplateButton();
    }
  }

  onCloneAssetCompleted(asset) {
    if (
      (this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE || this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW) &&
      this.state.currentStep === this.STEPS.CHOOSE_TEMPLATE
    ) {
      this.setState({
        formAsset: asset,
        name: asset.name,
        description: asset.settings.description,
        sector: asset.settings.sector,
        country: asset.settings.country,
        'share-metadata': asset.settings['share-metadata'] || false,
      });
      this.resetApplyTemplateButton();
      this.displayStep(this.STEPS.PROJECT_DETAILS);
    }
  }

  onCloneAssetFailed() {
    if (
      this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE ||
      this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW
    ) {
      this.resetApplyTemplateButton();
    }
  }

  getOrCreateFormAsset() {
    const assetPromise = new Promise((resolve, reject) => {
      if (this.state.formAsset) {
        resolve(this.state.formAsset);
      } else {
        dataInterface.createResource({
          name: 'Untitled',
          asset_type: 'survey',
          settings: JSON.stringify({
            description: '',
            sector: null,
            country: null,
            'share-metadata': false
          })
        }).done((asset) => {
          resolve(asset);
        }).fail(function(r){
          reject(t('Error: asset could not be created.') + ` (code: ${r.statusText})`);
        });
      }
    });
    return assetPromise;
  }

  createAssetAndOpenInBuilder() {
    const isCcpmSurvey = this.state.formAsset.content.survey.find(element => element.name === 'Partner_or_Coordinator_GROUP');
    const settings = JSON.stringify({
      description: this.state.description,
      sector: this.state.sector,
      country: this.state.country,
      'share-metadata': true,
      ccpmData: isCcpmSurvey ? {region: this.state.ccpmRegion,year: this.state.ccpmYear.toString(), cluster: this.state.ccpmCluster, addSubCluster: this.state.ccpmAddSubCluster, subCluster: this.state.ccpmSubCluster} : null,
    });
    dataInterface.createResource({
      name: this.state.name,
      settings,
      asset_type: 'survey',
    }).done((asset) => {
       this.goToFormBuilder(asset.uid);
    }).fail(function(r){
      alertify.error(t('Error: new CCPM could not be created.') + ` (code: ${r.statusText})`);
    });
  }

  updateAndOpenAsset() {
    const isCcpmSurvey = this.state.formAsset.content.survey.find(element => element.name === 'Partner_or_Coordinator_GROUP');
    actions.resources.updateAsset(
      this.state.formAsset.uid,
      {
        name: this.state.name,
        settings: JSON.stringify({
          description: this.state.description,
          sector: this.state.sector,
          country: this.state.country,
          'share-metadata': this.state['share-metadata'],
          ccpmData: isCcpmSurvey ? JSON.stringify({region: this.state.ccpmRegion, year: this.state.ccpmYear.toString(), cluster: this.state.ccpmCluster, addSubCluster: this.state.ccpmAddSubCluster, subCluster: this.state.ccpmSubCluster}) : null,
        }),
      }
    );
  }

  applyTemplate(evt) {
    evt.preventDefault();

    this.setState({
      isApplyTemplatePending: true,
      applyTemplateButton: t('Please wait…')
    });

    if (this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE) {
      actions.resources.updateAsset(
        this.state.formAsset.uid,
        {
          clone_from: this.state.chosenTemplateUid,
          name: this.state.formAsset.name
        }
      );
    } else {
      actions.resources.cloneAsset({
        uid: this.state.chosenTemplateUid,
        new_asset_type: 'survey'
      });
    }
  }

  importFromURL(evt) {
    evt.preventDefault();

    if (isAValidUrl(this.state.importUrl)) {
      this.setState({
        isImportFromURLPending: true,
        importUrlButtonEnabled: false,
        importUrlButton: t('Retrieving form, please wait...')
      });

      this.getOrCreateFormAsset().then(
        (asset) => {
          this.setState({formAsset: asset});
          const importUrl = this.state.importUrl;

          this.applyUrlToAsset(importUrl, asset).then(
            (data) => {
              dataInterface.getAsset({id: data.uid}).done((finalAsset) => {
                if (this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE) {
                  // when replacing, we omit PROJECT_DETAILS step
                  this.goToFormLanding();
                } else {
                  // TODO: allow serializers to take care of file names to
                  // remove this bandaid fix for "Untitled" filenames
                  var assetName = finalAsset.name;
                  if (assetName === 'Untitled') {
                    assetName = this.getFilenameFromURI(importUrl);
                  }
                  this.setState({
                    formAsset: finalAsset,
                    name: assetName,
                    description: finalAsset.settings.description,
                    sector: finalAsset.settings.sector,
                    country: finalAsset.settings.country,
                    'share-metadata': finalAsset.settings['share-metadata'],
                    isImportFromURLPending: false
                  });
                  this.displayStep(this.STEPS.PROJECT_DETAILS);
                }
              }).fail(() => {
                this.resetImportUrlButton();
                alertify.error(t('Failed to reload CCPM after import!'));
              });
            },
            (response) => {
              this.resetImportUrlButton();
              const errLines = [];
              errLines.push(t('Import Failed!'));
              if (importUrl) {
                errLines.push(`<code>Name: ${this.getFilenameFromURI(importUrl)}</code>`);
              }
              if (response.messages.error) {
                errLines.push(`<code>${response.messages.error_type}: ${escapeHtml(response.messages.error)}</code>`);
              }
              alertify.error(errLines.join('<br/>'));
            }
          );
        },
        () => {
          alertify.error(t('Could not initialize XLSForm import!'));
        }
      );
    }
  }

  onFileDrop(files) {
    if (files.length >= 1) {
      this.setState({isUploadFilePending: true});

      this.getOrCreateFormAsset().then(
        (asset) => {
          this.applyFileToAsset(files[0], asset).then(
            (data) => {
              dataInterface.getAsset({id: data.uid}).done((finalAsset) => {
                // TODO: Getting asset outside of actions.resources.loadAsset
                // is not going to notify all the listeners, causing some hard
                // to identify bugs.
                // Until we switch this code to use actions we HACK it so other
                // places are notified.
                actions.resources.loadAsset.completed(finalAsset);

                if (this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE) {
                  // when replacing, we omit PROJECT_DETAILS step
                  this.goToFormLanding();
                } else {
                  // TODO: allow serializers to take care of file names to
                  // remove this bandaid fix for "Untitled" filenames
                  var assetName = finalAsset.name;
                  if (assetName === 'Untitled') {
                    assetName = files[0].name.split('.xlsx')[0];
                  }
                  this.setState({
                    formAsset: finalAsset,
                    name: assetName,
                    description: finalAsset.settings.description,
                    sector: finalAsset.settings.sector,
                    country: finalAsset.settings.country,
                    'share-metadata': finalAsset.settings['share-metadata'],
                    isUploadFilePending: false
                  });
                  this.displayStep(this.STEPS.PROJECT_DETAILS);
                }
              }).fail(() => {
                this.setState({isUploadFilePending: false});
                alertify.error(t('Failed to reload CCPM after upload!'));
              });
            },
            (response) => {
              this.setState({isUploadFilePending: false});
              const errLines = [];
              errLines.push(t('Import Failed!'));
              if (files[0].name) {
                errLines.push(`<code>Name: ${files[0].name}</code>`);
              }
              if (response.messages.error) {
                errLines.push(`<code>${response.messages.error_type}: ${escapeHtml(response.messages.error)}</code>`);
              }
              alertify.error(errLines.join('<br/>'));
            }
          );
        },
        () => {
          this.setState({isUploadFilePending: false});
          alertify.error(t('Could not import XLSForm!'));
        }
      );
    }
  }

  handleSubmit(evt) {
    const isCcpmSurvey = this.state.formAsset.content.survey.find(element => element.name === 'Partner_or_Coordinator_GROUP');
    evt.preventDefault();

    // simple non-empty name validation
    if (!this.state.name.trim()) {
      alertify.error(t('Please enter a name for your CCPM.'));
      return;
    }

    if (isCcpmSurvey && !this.state.ccpmYear.trim()) {
      alertify.error(t('Please enter a year for your CCPM.'));
      return;
    }

    if (isCcpmSurvey && !this.state.ccpmRegion) {
      alertify.error(t('Please select a region for your CCPM.'));
      return;
    }

    if (isCcpmSurvey && !this.state.ccpmCluster.trim()) {
      alertify.error(t('Please enter a country/cluster for your CCPM.'));
      return;
    }

    if (!this.state.ccpmSubCluster.trim() && this.state.ccpmAddSubCluster) {
      alertify.error(t('Please enter a sub-cluster for your CCPM.'));
      return;
    }

    this.setState({isSubmitPending: true});

    if (this.state.formAsset) {
      this.updateAndOpenAsset();
    } else {
      this.createAssetAndOpenInBuilder();
    }
  }

  /*
   * rendering
   */

  getNameInputLabel(nameVal) {
    let label = t('CCPM Name');
    if (nameVal.length >= NAME_MAX_LENGTH - 99) {
      label += ` (${t('##count## characters left').replace('##count##', NAME_MAX_LENGTH - nameVal.length)})`;
    }
    return label;
  }

  renderChooseTemplateButton() {
    return (
      <button onClick={this.displayStep.bind(this, this.STEPS.CHOOSE_TEMPLATE)}>
        <i className='k-icon-template' />
        {t('Use a template')}
      </button>
    );
  }

  renderStepFormSource() {
    return (
      <bem.FormModal__form className='project-settings project-settings--form-source'>
        {this.props.context !== PROJECT_SETTINGS_CONTEXTS.REPLACE &&
          <bem.Modal__subheader>
            {t('Choose one of the options below to continue. You will be prompted to enter name and other details in further steps.')}
          </bem.Modal__subheader>
        }

        <bem.FormModal__item m='form-source-buttons'>
          {this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW &&
            <button onClick={this.displayStep.bind(this, this.STEPS.PROJECT_DETAILS)}>
              <i className='k-icon-edit' />
              {t('Build from scratch')}
            </button>
          }

          {this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW &&
            this.renderChooseTemplateButton()
          }

          <button onClick={this.displayStep.bind(this, this.STEPS.UPLOAD_FILE)}>
            <i className='k-icon-upload' />
            {t('Upload an XLSForm')}
          </button>

          <button onClick={this.displayStep.bind(this, this.STEPS.IMPORT_URL)}>
            <i className='k-icon-link' />
            {t('Import an XLSForm via URL')}
          </button>

          {this.props.context !== PROJECT_SETTINGS_CONTEXTS.NEW &&
            this.renderChooseTemplateButton()
          }
        </bem.FormModal__item>
      </bem.FormModal__form>
    );
  }

  renderStepChooseTemplate() {
    return (
      <bem.FormModal__form className='project-settings project-settings--choose-template'>
        <TemplatesList onSelectTemplate={this.onTemplateChange}/>

        <bem.Modal__footer>
          {this.renderBackButton()}

          <bem.KoboButton
            m='blue'
            type='submit'
            onClick={this.applyTemplate}
            disabled={!this.state.chosenTemplateUid || this.state.isApplyTemplatePending}
          >
            {this.state.applyTemplateButton}
          </bem.KoboButton>
        </bem.Modal__footer>
      </bem.FormModal__form>
    );
  }

  renderStepUploadFile() {
    return (
      <bem.FormModal__form className='project-settings project-settings--upload-file'>
        <bem.Modal__subheader>
          {t('Import an XLSForm from your computer.')}
        </bem.Modal__subheader>

        {!this.state.isUploadFilePending &&
          <Dropzone
            onDrop={this.onFileDrop.bind(this)}
            multiple={false}
            className='dropzone'
            activeClassName='dropzone-active'
            rejectClassName='dropzone-reject'
            accept={validFileTypes()}
          >
            <i className='k-icon-xls-file' />
            {t(' Drag and drop the XLSForm file here or click to browse')}
          </Dropzone>
        }
        {this.state.isUploadFilePending &&
          <div className='dropzone'>
            {this.renderLoading(t('Uploading file…'))}
          </div>
        }

        <bem.Modal__footer>
          {this.renderBackButton()}
        </bem.Modal__footer>
      </bem.FormModal__form>
    );
  }

  renderStepImportUrl() {
    return (
      <bem.FormModal__form className='project-settings project-settings--import-url'>
        <div className='intro'>
          {t('Enter a valid XLSForm URL in the field below.')}<br/>

          { stores.serverEnvironment &&
            stores.serverEnvironment.state.support_url &&
            <a href={stores.serverEnvironment.state.support_url + VIA_URL_SUPPORT_URL} target='_blank'>
              {t('Having issues? See this help article.')}
            </a>
          }
        </div>

        <bem.FormModal__item>
          <TextBox
            type='url'
            label={t('URL')}
            placeholder='https://'
            value={this.state.importUrl}
            onChange={this.onImportUrlChange}
          />
        </bem.FormModal__item>

        <bem.Modal__footer>
          {this.renderBackButton()}

          <bem.KoboButton
            m='blue'
            type='submit'
            onClick={this.importFromURL}
            disabled={!this.state.importUrlButtonEnabled}
          >
            {this.state.importUrlButton}
          </bem.KoboButton>
        </bem.Modal__footer>
      </bem.FormModal__form>
    );
  }

  renderStepProjectDetails() {
    const sectors = stores.session.environment.available_sectors;
    const countries = stores.session.environment.available_countries;
    const ccpmRegions = stores.session.environment.ccpm_available_regions;
    const isSelfOwned = this.userIsOwner(this.state.formAsset);

    return (
      <bem.FormModal__form
        onSubmit={this.handleSubmit}
        onChange={this.onProjectDetailsFormChange}
        className={[
          'project-settings',
          'project-settings--project-details',
          this.props.context === PROJECT_SETTINGS_CONTEXTS.BUILDER ? 'project-settings--narrow' : null
        ].join(' ')}
      >
        {this.props.context === PROJECT_SETTINGS_CONTEXTS.EXISTING &&
          <bem.Modal__footer>
            <bem.KoboButton
              type='submit'
              m='blue'
              onClick={this.handleSubmit}
            >
              {t('Save Changes')}
            </bem.KoboButton>
          </bem.Modal__footer>
        }

        <bem.FormModal__item m='wrapper'>
          {/* form builder displays name in different place */}
          {this.props.context !== PROJECT_SETTINGS_CONTEXTS.BUILDER &&
            <bem.FormModal__item>
              <label htmlFor='name'>
                {this.getNameInputLabel(this.state.name)}
              </label>
              <input
                type='text'
                maxLength={NAME_MAX_LENGTH}
                id='name'
                placeholder={t('Enter title of CCPM here')}
                value={this.state.name}
                onChange={this.onNameChange}
              />
            </bem.FormModal__item>
          }

          <bem.FormModal__item>
            <label htmlFor='description'>
              {t('Description')}
            </label>
            <TextareaAutosize
              onChange={this.onDescriptionChange}
              value={this.state.description}
              placeholder={t('Enter short description here')}
            />
          </bem.FormModal__item>

          {/* <bem.FormModal__item>
            <label className='long'>
              {t('Please specify the country and the sector where this project will be deployed. ')}
              {t('This information will be used to help you filter results on the project list page.')}
            </label>
          </bem.FormModal__item> */}

          {/* <bem.FormModal__item m='sector'>
            <label htmlFor='sector'>
              {t('Sector')}
            </label>
            <Select
              id='sector'
              value={this.state.sector}
              onChange={this.onSectorChange}
              options={sectors}
              className='kobo-select'
              classNamePrefix='kobo-select'
              menuPlacement='auto'
              isClearable
            />
          </bem.FormModal__item> */}

          {/* <bem.FormModal__item m='country'>
            <label htmlFor='country'>
              {t('Country')}
            </label>
            <Select
              id='country'
              value={this.state.country}
              onChange={this.onCountryChange}
              options={countries}
              className='kobo-select'
              classNamePrefix='kobo-select'
              menuPlacement='auto'
              isClearable
            />
          </bem.FormModal__item> */}

          {/* <bem.FormModal__item m='metadata-share'>
            <Checkbox
              checked={this.state['share-metadata']}
              onChange={this.onShareMetadataChange}
              label={t('Help KoboToolbox improve this product by sharing the sector and country where this project will be deployed.') + ' ' + t('All the information is submitted anonymously, and will not include the project name or description listed above.')}
            />
          </bem.FormModal__item> */}

          <bem.FormModal__item>
            <label>
              {t('Year')}
            </label>
            <TextareaAutosize
              onChange={this.onCCPMYearChange}
              value={this.state.ccpmYear}
              placeholder={t('Year')}
            />
          </bem.FormModal__item>

          <bem.FormModal__item>
            <label>
              {t('Region')}
            </label>
            <Select
              id='ccpmRegion'
              value={this.state.ccpmRegion}
              onChange={this.onCCPMRegionChange}
              options={ccpmRegions}
              className='kobo-select'
              classNamePrefix='kobo-select'
              menuPlacement='auto'
              isClearable
            />
          </bem.FormModal__item>

          <bem.FormModal__item>
            <label>
              {t('Country/Cluster')}
            </label>
            <TextareaAutosize
              onChange={this.onCCPMClusterChange}
              value={this.state.ccpmCluster}
              placeholder={t('Country/Cluster')}
            />
          </bem.FormModal__item>

          <bem.FormModal__item>
            <bem.FormModal__item>
              <Checkbox
                checked={this.state.ccpmAddSubCluster}
                onChange={this.onCCPMAddSubClusterChange}
                label={t('Creating a Sub National CCPM?')}
              />
            </bem.FormModal__item>

            { this.state.ccpmAddSubCluster &&
              <bem.FormModal__item>
                <label>
                  {t('Sub-Cluster')}
                </label>
                <TextareaAutosize
                  onChange={this.onCCPMSubClusterChange}
                  value={this.state.ccpmSubCluster}
                  placeholder={t('Sub-Cluster')}
                />
              </bem.FormModal__item>
            }
          </bem.FormModal__item>

          <bem.FormModal__item m='ccpm-metadata-share' />

          {(this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW || this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE) &&
            <bem.Modal__footer>
              {/* Don't allow going back if asset already exist */}
              {!this.state.formAsset &&
                this.renderBackButton()
              }

              <bem.KoboButton
                m='blue'
                type='submit'
                onClick={this.handleSubmit}
                disabled={this.state.isSubmitPending}
              >
                {this.state.isSubmitPending && t('Please wait…')}
                {!this.state.isSubmitPending && this.props.context === PROJECT_SETTINGS_CONTEXTS.NEW && t('New CCPM')}
                {!this.state.isSubmitPending && this.props.context === PROJECT_SETTINGS_CONTEXTS.REPLACE && t('Save')}
              </bem.KoboButton>
            </bem.Modal__footer>
          }

          {this.props.context === PROJECT_SETTINGS_CONTEXTS.EXISTING &&
            <bem.FormModal__item>
              <bem.FormModal__item m='inline'>
                {this.isArchived() &&
                  <bem.KoboButton
                    m='blue'
                    onClick={this.unarchiveProject}
                  >
                    {t('Unarchive CCPM')}
                  </bem.KoboButton>
                }

                {!this.isArchived() &&
                  <bem.KoboButton
                    m='orange'
                    onClick={this.archiveProject}
                  >
                    {t('Archive CCPM')}
                  </bem.KoboButton>
                }
              </bem.FormModal__item>

              <bem.FormModal__item m='inline'>
                {this.isArchived() ? t('Unarchive CCPM to resume accepting submissions.') : t('Archive CCPM to stop accepting submissions.')}
              </bem.FormModal__item>
            </bem.FormModal__item>
          }

          {isSelfOwned && this.props.context === PROJECT_SETTINGS_CONTEXTS.EXISTING &&
            <bem.FormModal__item>
              <bem.KoboButton m='red' onClick={this.deleteProject}>
                {t('Delete CCPM and Data')}
              </bem.KoboButton>
            </bem.FormModal__item>
          }
        </bem.FormModal__item>
      </bem.FormModal__form>
    );
  }

  renderBackButton() {
    if (this.state.previousStep) {
      const isBackButtonDisabled = (
        this.state.isSubmitPending ||
        this.state.isApplyTemplatePending ||
        this.state.isImportFromURLPending ||
        this.state.isUploadFilePending
      );
      return (
        <bem.KoboButton
          m='whitegray'
          type='button'
          onClick={this.displayPreviousStep}
          disabled={isBackButtonDisabled}
        >
          {t('Back')}
        </bem.KoboButton>
      );
    } else {
      return false;
    }
  }

  renderLoading(message = t('loading…')) {
    return (
      <bem.Loading>
        <bem.Loading__inner>
          <i />
          {message}
        </bem.Loading__inner>
      </bem.Loading>
    );
  }

  render() {
    if (!this.state.isSessionLoaded || !this.state.currentStep) {
      return this.renderLoading();
    }

    switch (this.state.currentStep) {
      case this.STEPS.FORM_SOURCE: return this.renderStepFormSource();
      case this.STEPS.CHOOSE_TEMPLATE: return this.renderStepChooseTemplate();
      case this.STEPS.UPLOAD_FILE: return this.renderStepUploadFile();
      case this.STEPS.IMPORT_URL: return this.renderStepImportUrl();
      case this.STEPS.PROJECT_DETAILS: return this.renderStepProjectDetails();
      default:
        throw new Error(`Unknown step: ${this.state.currentStep}!`);
    }
  }
}

reactMixin(ProjectSettings.prototype, Reflux.ListenerMixin);
reactMixin(ProjectSettings.prototype, mixins.permissions);
reactMixin(ProjectSettings.prototype, mixins.droppable);
reactMixin(ProjectSettings.prototype, mixins.dmix);

ProjectSettings.contextTypes = {
  router: PropTypes.object
};

export default ProjectSettings;
