# coding: utf-8
# 😬
from django.utils.translation import ugettext_lazy as _

# This file is a place to store static, translatable strings

SECTORS = (
    # (value, human-readable label)
    ("Public Administration", _("Public Administration")),
    ("Arts, Entertainment, and Recreation", _("Arts, Entertainment, and Recreation")),
    ("Educational Services / Higher Education", _("Educational Services / Higher Education")),
    ("Health Services / Public Health", _("Health Services / Public Health")),
    ("Finance and Insurance", _("Finance and Insurance")),
    ("Information / Media", _("Information / Media")),
    ("Economic/Social Development", _("Economic/Social Development")),
    ("Security / Police / Peacekeeping", _("Security / Police / Peacekeeping")),
    ("Disarmament & Demobilization", _("Disarmament & Demobilization")),
    ("Environment", _("Environment")),
    ("Private sector", _("Private sector")),
    ("Humanitarian - Coordination / Information Management", _("Humanitarian - Coordination / Information Management")),
    ("Humanitarian - Multiple Clusters", _("Humanitarian - Multiple Clusters")),
    ("Humanitarian - Camp Management & Coordination", _("Humanitarian - Camp Management & Coordination")),
    ("Humanitarian - Early Recovery", _("Humanitarian - Early Recovery")),
    ("Humanitarian - Education", _("Humanitarian - Education")),
    ("Humanitarian - Emergency Shelter", _("Humanitarian - Emergency Shelter")),
    ("Humanitarian - Emergency Telecoms", _("Humanitarian - Emergency Telecoms")),
    ("Humanitarian - Food Security", _("Humanitarian - Food Security")),
    ("Humanitarian - Health", _("Humanitarian - Health")),
    ("Humanitarian - Logistics", _("Humanitarian - Logistics")),
    ("Humanitarian - Nutrition", _("Humanitarian - Nutrition")),
    ("Humanitarian - Protection", _("Humanitarian - Protection")),
    ("Humanitarian - Sanitation, Water & Hygiene", _("Humanitarian - Sanitation, Water & Hygiene")),
    ("Other", _("Other")),
)

# You might generate such a list of countries with code like this:
#
#     #     import sys
#
#     url = 'https://www.humanitarianresponse.info/api/v1.0/locations?filter[admin_level]=0'
#     while url:
#         print('Fetching', url, file=sys.stderr)
#         response = requests.get(url)
#         j = response.json()
#         if 'next' in j:
#             url = j['next']['href']
#         else:
#             url = None
#         for d in j['data']:
#             print("({}, _({}))".format(repr(d['iso3']), repr(d['label'])))
COUNTRIES = (
    # (value, human-readable label)
    ('AFG', _('Afghanistan')),
    ('ALA', _('\xc5land Islands')),
    ('ALB', _('Albania')),
    ('DZA', _('Algeria')),
    ('ASM', _('American Samoa')),
    ('AND', _('Andorra')),
    ('AGO', _('Angola')),
    ('AIA', _('Anguilla')),
    ('ATA', _('Antarctica')),
    ('ATG', _('Antigua and Barbuda')),
    ('ARG', _('Argentina')),
    ('ARM', _('Armenia')),
    ('ABW', _('Aruba')),
    ('AUS', _('Australia')),
    ('AUT', _('Austria')),
    ('AZE', _('Azerbaijan')),
    ('BHS', _('Bahamas')),
    ('BHR', _('Bahrain')),
    ('BGD', _('Bangladesh')),
    ('BRB', _('Barbados')),
    ('BLR', _('Belarus')),
    ('BEL', _('Belgium')),
    ('BLZ', _('Belize')),
    ('BEN', _('Benin')),
    ('BMU', _('Bermuda')),
    ('BTN', _('Bhutan')),
    ('BOL', _('Bolivia, Plurinational State of')),
    ('BIH', _('Bosnia and Herzegovina')),
    ('BES', _('Bonaire, Sint Eustatius and Saba')),
    ('BWA', _('Botswana')),
    ('BVT', _('Bouvet Island')),
    ('BRA', _('Brazil')),
    ('IOT', _('British Indian Ocean Territory')),
    ('BRN', _('Brunei Darussalam')),
    ('BGR', _('Bulgaria')),
    ('BFA', _('Burkina Faso')),
    ('BDI', _('Burundi')),
    ('KHM', _('Cambodia')),
    ('CMR', _('Cameroon')),
    ('CAN', _('Canada')),
    ('CPV', _('Cape Verde')),
    ('CYM', _('Cayman Islands')),
    ('CAF', _('Central African Republic')),
    ('TCD', _('Chad')),
    ('CHL', _('Chile')),
    ('CHN', _('China')),
    ('CXR', _('Christmas Island')),
    ('CCK', _('Cocos (Keeling) Islands')),
    ('COL', _('Colombia')),
    ('COM', _('Comoros')),
    ('COG', _('Congo')),
    ('COD', _('Congo, The Democratic Republic of the')),
    ('COK', _('Cook Islands')),
    ('CRI', _('Costa Rica')),
    ('CIV', _("C\xf4te d'Ivoire")),
    ('HRV', _('Croatia')),
    ('CUB', _('Cuba')),
    ('CUW', _('Cura\xe7ao')),
    ('CYP', _('Cyprus')),
    ('CZE', _('Czech Republic')),
    ('DNK', _('Denmark')),
    ('DJI', _('Djibouti')),
    ('DMA', _('Dominica')),
    ('DOM', _('Dominican Republic')),
    ('ECU', _('Ecuador')),
    ('EGY', _('Egypt')),
    ('SLV', _('El Salvador')),
    ('GNQ', _('Equatorial Guinea')),
    ('ERI', _('Eritrea')),
    ('EST', _('Estonia')),
    ('ETH', _('Ethiopia')),
    ('FLK', _('Falkland Islands (Malvinas)')),
    ('FRO', _('Faroe Islands')),
    ('FJI', _('Fiji')),
    ('FIN', _('Finland')),
    ('FRA', _('France')),
    ('GUF', _('French Guiana')),
    ('PYF', _('French Polynesia')),
    ('ATF', _('French Southern Territories')),
    ('GAB', _('Gabon')),
    ('GMB', _('Gambia')),
    ('GEO', _('Georgia')),
    ('DEU', _('Germany')),
    ('GHA', _('Ghana')),
    ('GIB', _('Gibraltar')),
    ('GRC', _('Greece')),
    ('GRL', _('Greenland')),
    ('GRD', _('Grenada')),
    ('GLP', _('Guadeloupe')),
    ('GUM', _('Guam')),
    ('GTM', _('Guatemala')),
    ('GGY', _('Guernsey')),
    ('GIN', _('Guinea')),
    ('GNB', _('Guinea-Bissau')),
    ('GUY', _('Guyana')),
    ('HTI', _('Haiti')),
    ('HMD', _('Heard Island and McDonald Islands')),
    ('VAT', _('Holy See (Vatican City State)')),
    ('HND', _('Honduras')),
    ('HKG', _('Hong Kong')),
    ('HUN', _('Hungary')),
    ('ISL', _('Iceland')),
    ('IND', _('India')),
    ('IDN', _('Indonesia')),
    ('IRN', _('Iran, Islamic Republic of')),
    ('IRQ', _('Iraq')),
    ('IRL', _('Ireland')),
    ('IMN', _('Isle of Man')),
    ('ISR', _('Israel')),
    ('ITA', _('Italy')),
    ('JAM', _('Jamaica')),
    ('JPN', _('Japan')),
    ('JEY', _('Jersey')),
    ('JOR', _('Jordan')),
    ('KAZ', _('Kazakhstan')),
    ('KEN', _('Kenya')),
    ('KIR', _('Kiribati')),
    ('PRK', _("Korea, Democratic People's Republic of")),
    ('KOR', _('Korea, Republic of')),
    ('KWT', _('Kuwait')),
    ('KGZ', _('Kyrgyzstan')),
    ('LAO', _("Lao People's Democratic Republic")),
    ('LVA', _('Latvia')),
    ('LBN', _('Lebanon')),
    ('LSO', _('Lesotho')),
    ('LBR', _('Liberia')),
    ('LBY', _('Libya')),
    ('LIE', _('Liechtenstein')),
    ('LTU', _('Lithuania')),
    ('LUX', _('Luxembourg')),
    ('MAC', _('Macao')),
    ('MKD', _('Macedonia, The Former Yugoslav Republic of')),
    ('MDG', _('Madagascar')),
    ('MWI', _('Malawi')),
    ('MYS', _('Malaysia')),
    ('MDV', _('Maldives')),
    ('MLI', _('Mali')),
    ('MLT', _('Malta')),
    ('MHL', _('Marshall Islands')),
    ('MTQ', _('Martinique')),
    ('MRT', _('Mauritania')),
    ('MUS', _('Mauritius')),
    ('MYT', _('Mayotte')),
    ('MEX', _('Mexico')),
    ('FSM', _('Micronesia, Federated States of')),
    ('MDA', _('Moldova, Republic of')),
    ('MCO', _('Monaco')),
    ('MNG', _('Mongolia')),
    ('MNE', _('Montenegro')),
    ('MSR', _('Montserrat')),
    ('MAR', _('Morocco')),
    ('MOZ', _('Mozambique')),
    ('MMR', _('Myanmar')),
    ('NAM', _('Namibia')),
    ('NRU', _('Nauru')),
    ('NPL', _('Nepal')),
    ('NLD', _('Netherlands')),
    ('ANT', _('Netherlands Antilles')),
    ('NCL', _('New Caledonia')),
    ('NZL', _('New Zealand')),
    ('NIC', _('Nicaragua')),
    ('NER', _('Niger')),
    ('NGA', _('Nigeria')),
    ('NIU', _('Niue')),
    ('NFK', _('Norfolk Island')),
    ('MNP', _('Northern Mariana Islands')),
    ('NOR', _('Norway')),
    ('OMN', _('Oman')),
    ('PAK', _('Pakistan')),
    ('PLW', _('Palau')),
    ('PSE', _('occupied Palestinian territory')),
    ('PAN', _('Panama')),
    ('PNG', _('Papua New Guinea')),
    ('PRY', _('Paraguay')),
    ('PER', _('Peru')),
    ('PHL', _('Philippines')),
    ('PCN', _('Pitcairn')),
    ('POL', _('Poland')),
    ('PRT', _('Portugal')),
    ('PRI', _('Puerto Rico')),
    ('QAT', _('Qatar')),
    ('REU', _('R\xe9union')),
    ('ROU', _('Romania')),
    ('RUS', _('Russian Federation')),
    ('RWA', _('Rwanda')),
    ('BLM', _('Saint Barth\xe9lemy')),
    ('SHN', _('Saint Helena, Ascension and Tristan da Cunha')),
    ('KNA', _('Saint Kitts and Nevis')),
    ('LCA', _('Saint Lucia')),
    ('MAF', _('Saint Martin (French part)')),
    ('SPM', _('Saint Pierre and Miquelon')),
    ('VCT', _('Saint Vincent and the Grenadines')),
    ('WSM', _('Samoa')),
    ('SMR', _('San Marino')),
    ('STP', _('S\xe3o Tom\xe9 and Pr\xedncipe')),
    ('SAU', _('Saudi Arabia')),
    ('SEN', _('Senegal')),
    ('SRB', _('Serbia')),
    ('SYC', _('Seychelles')),
    ('SLE', _('Sierra Leone')),
    ('SGP', _('Singapore')),
    ('SXM', _('Sint Maarten (Dutch part)')),
    ('SVK', _('Slovakia')),
    ('SVN', _('Slovenia')),
    ('SLB', _('Solomon Islands')),
    ('SOM', _('Somalia')),
    ('ZAF', _('South Africa')),
    ('SGS', _('South Georgia and the South Sandwich Islands')),
    ('ESP', _('Spain')),
    ('LKA', _('Sri Lanka')),
    ('SSD', _('South Sudan')),
    ('SDN', _('Sudan')),
    ('SUR', _('Suriname')),
    ('SJM', _('Svalbard and Jan Mayen')),
    ('SWZ', _('Swaziland')),
    ('SWE', _('Sweden')),
    ('CHE', _('Switzerland')),
    ('SYR', _('Syrian Arab Republic')),
    ('TWN', _('Taiwan, Province of China')),
    ('TJK', _('Tajikistan')),
    ('TZA', _('Tanzania, United Republic of')),
    ('THA', _('Thailand')),
    ('TLS', _('Timor-Leste')),
    ('TGO', _('Togo')),
    ('TKL', _('Tokelau')),
    ('TON', _('Tonga')),
    ('TTO', _('Trinidad and Tobago')),
    ('TUN', _('Tunisia')),
    ('TUR', _('Turkey')),
    ('TKM', _('Turkmenistan')),
    ('TCA', _('Turks and Caicos Islands')),
    ('TUV', _('Tuvalu')),
    ('UGA', _('Uganda')),
    ('UKR', _('Ukraine')),
    ('ARE', _('United Arab Emirates')),
    ('GBR', _('United Kingdom')),
    ('USA', _('United States')),
    ('UMI', _('United States Minor Outlying Islands')),
    ('URY', _('Uruguay')),
    ('UZB', _('Uzbekistan')),
    ('VUT', _('Vanuatu')),
    ('VEN', _('Venezuela, Bolivarian Republic of')),
    ('VNM', _('Viet Nam')),
    ('VGB', _('Virgin Islands, British')),
    ('VIR', _('Virgin Islands, U.S.')),
    ('WLF', _('Wallis and Futuna')),
    ('ESH', _('Western Sahara')),
    ('YEM', _('Yemen')),
    ('ZMB', _('Zambia')),
    ('ZWE', _('Zimbabwe')),
)

# You might generate such a list of languages with code like this:
#
#     import requests
#     url = 'http://loc.gov/standards/iso639-2/ISO-639-2_utf-8.txt'
#     response = requests.get(url)
#     for line in response.iter_lines():
#         # Wow, the LOC does not specify an encoding in the response!
#         line = line.decode(response.apparent_encoding)
#         fields = line.strip().split('|')
#         if fields[2]:
#             print '({}, _({})),'.format(repr(fields[2]), repr(fields[3]))
LANGUAGES = (
    # (value, human-readable label)
    ('aa', _('Afar')),
    ('ab', _('Abkhazian')),
    ('af', _('Afrikaans')),
    ('ak', _('Akan')),
    ('sq', _('Albanian')),
    ('am', _('Amharic')),
    ('ar', _('Arabic')),
    ('an', _('Aragonese')),
    ('hy', _('Armenian')),
    ('as', _('Assamese')),
    ('av', _('Avaric')),
    ('ae', _('Avestan')),
    ('ay', _('Aymara')),
    ('az', _('Azerbaijani')),
    ('ba', _('Bashkir')),
    ('bm', _('Bambara')),
    ('eu', _('Basque')),
    ('be', _('Belarusian')),
    ('bn', _('Bengali')),
    ('bh', _('Bihari languages')),
    ('bi', _('Bislama')),
    ('bs', _('Bosnian')),
    ('br', _('Breton')),
    ('bg', _('Bulgarian')),
    ('my', _('Burmese')),
    ('ca', _('Catalan; Valencian')),
    ('ch', _('Chamorro')),
    ('ce', _('Chechen')),
    ('zh', _('Chinese')),
    ('cu', _('Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic')),
    ('cv', _('Chuvash')),
    ('kw', _('Cornish')),
    ('co', _('Corsican')),
    ('cr', _('Cree')),
    ('cs', _('Czech')),
    ('da', _('Danish')),
    ('dv', _('Divehi; Dhivehi; Maldivian')),
    ('nl', _('Dutch; Flemish')),
    ('dz', _('Dzongkha')),
    ('en', _('English')),
    ('eo', _('Esperanto')),
    ('et', _('Estonian')),
    ('ee', _('Ewe')),
    ('fo', _('Faroese')),
    ('fj', _('Fijian')),
    ('fi', _('Finnish')),
    ('fr', _('French')),
    ('fy', _('Western Frisian')),
    ('ff', _('Fulah')),
    ('ka', _('Georgian')),
    ('de', _('German')),
    ('gd', _('Gaelic; Scottish Gaelic')),
    ('ga', _('Irish')),
    ('gl', _('Galician')),
    ('gv', _('Manx')),
    ('el', _('Greek, Modern (1453-)')),
    ('gn', _('Guarani')),
    ('gu', _('Gujarati')),
    ('ht', _('Haitian; Haitian Creole')),
    ('ha', _('Hausa')),
    ('he', _('Hebrew')),
    ('hz', _('Herero')),
    ('hi', _('Hindi')),
    ('ho', _('Hiri Motu')),
    ('hr', _('Croatian')),
    ('hu', _('Hungarian')),
    ('ig', _('Igbo')),
    ('is', _('Icelandic')),
    ('io', _('Ido')),
    ('ii', _('Sichuan Yi; Nuosu')),
    ('iu', _('Inuktitut')),
    ('ie', _('Interlingue; Occidental')),
    ('ia', _('Interlingua (International Auxiliary Language Association)')),
    ('id', _('Indonesian')),
    ('ik', _('Inupiaq')),
    ('it', _('Italian')),
    ('jv', _('Javanese')),
    ('ja', _('Japanese')),
    ('kl', _('Kalaallisut; Greenlandic')),
    ('kn', _('Kannada')),
    ('ks', _('Kashmiri')),
    ('kr', _('Kanuri')),
    ('kk', _('Kazakh')),
    ('km', _('Central Khmer')),
    ('ki', _('Kikuyu; Gikuyu')),
    ('rw', _('Kinyarwanda')),
    ('ky', _('Kirghiz; Kyrgyz')),
    ('kv', _('Komi')),
    ('kg', _('Kongo')),
    ('ko', _('Korean')),
    ('kj', _('Kuanyama; Kwanyama')),
    ('ku', _('Kurdish')),
    ('lo', _('Lao')),
    ('la', _('Latin')),
    ('lv', _('Latvian')),
    ('li', _('Limburgan; Limburger; Limburgish')),
    ('ln', _('Lingala')),
    ('lt', _('Lithuanian')),
    ('lb', _('Luxembourgish; Letzeburgesch')),
    ('lu', _('Luba-Katanga')),
    ('lg', _('Ganda')),
    ('mk', _('Macedonian')),
    ('mh', _('Marshallese')),
    ('ml', _('Malayalam')),
    ('mi', _('Maori')),
    ('mr', _('Marathi')),
    ('ms', _('Malay')),
    ('mg', _('Malagasy')),
    ('mt', _('Maltese')),
    ('mn', _('Mongolian')),
    ('na', _('Nauru')),
    ('nv', _('Navajo; Navaho')),
    ('nr', _('Ndebele, South; South Ndebele')),
    ('nd', _('Ndebele, North; North Ndebele')),
    ('ng', _('Ndonga')),
    ('ne', _('Nepali')),
    ('nn', _('Norwegian Nynorsk; Nynorsk, Norwegian')),
    ('nb', _('Bokm\xe5l, Norwegian; Norwegian Bokm\xe5l')),
    ('no', _('Norwegian')),
    ('ny', _('Chichewa; Chewa; Nyanja')),
    ('oc', _('Occitan (post 1500); Proven\xe7al')),
    ('oj', _('Ojibwa')),
    ('or', _('Oriya')),
    ('om', _('Oromo')),
    ('os', _('Ossetian; Ossetic')),
    ('pa', _('Panjabi; Punjabi')),
    ('fa', _('Persian')),
    ('pi', _('Pali')),
    ('pl', _('Polish')),
    ('pt', _('Portuguese')),
    ('ps', _('Pushto; Pashto')),
    ('qu', _('Quechua')),
    ('rm', _('Romansh')),
    ('ro', _('Romanian; Moldavian; Moldovan')),
    ('rn', _('Rundi')),
    ('ru', _('Russian')),
    ('sg', _('Sango')),
    ('sa', _('Sanskrit')),
    ('si', _('Sinhala; Sinhalese')),
    ('sk', _('Slovak')),
    ('sl', _('Slovenian')),
    ('se', _('Northern Sami')),
    ('sm', _('Samoan')),
    ('sn', _('Shona')),
    ('sd', _('Sindhi')),
    ('so', _('Somali')),
    ('st', _('Sotho, Southern')),
    ('es', _('Spanish; Castilian')),
    ('sc', _('Sardinian')),
    ('sr', _('Serbian')),
    ('ss', _('Swati')),
    ('su', _('Sundanese')),
    ('sw', _('Swahili')),
    ('sv', _('Swedish')),
    ('ty', _('Tahitian')),
    ('ta', _('Tamil')),
    ('tt', _('Tatar')),
    ('te', _('Telugu')),
    ('tg', _('Tajik')),
    ('tl', _('Tagalog')),
    ('th', _('Thai')),
    ('bo', _('Tibetan')),
    ('ti', _('Tigrinya')),
    ('to', _('Tonga (Tonga Islands)')),
    ('tn', _('Tswana')),
    ('ts', _('Tsonga')),
    ('tk', _('Turkmen')),
    ('tr', _('Turkish')),
    ('tw', _('Twi')),
    ('ug', _('Uighur; Uyghur')),
    ('uk', _('Ukrainian')),
    ('ur', _('Urdu')),
    ('uz', _('Uzbek')),
    ('ve', _('Venda')),
    ('vi', _('Vietnamese')),
    ('vo', _('Volap\xfck')),
    ('cy', _('Welsh')),
    ('wa', _('Walloon')),
    ('wo', _('Wolof')),
    ('xh', _('Xhosa')),
    ('yi', _('Yiddish')),
    ('yo', _('Yoruba')),
    ('za', _('Zhuang; Chuang')),
    ('zu', _('Zulu')),
)

# Whenever we add a translation that Django itself does not support, add
# information about the language here. This dictionary will be used to update
# `django.conf.locale.LANG_INFO`
EXTRA_LANG_INFO = {
    'ku': {
        'bidi': True,
        'code': 'ku',
        'name': 'Kurdish',
        'name_local': 'كوردی',
    },
}

CCPM_REGIONS = (
    ('afro', _('AFRO')),
    ('amro', _('AMRO')),
    ('searo', _('SEARO')),
    ('euro', _('EURO')),
    ('emro', _('EMRO')),
    ('wpro', _('WPRO')),
)
