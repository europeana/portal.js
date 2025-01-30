const services = [
  {
    cookies: ['auth.strategy'],
    name: 'auth-strategy',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['debugSettings'],
    name: 'debugSettings',
    purposes: ['essential'],
    required: true
  },
  {
  // https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information
    cookies: [/^_hj/],
    name: 'hotjar',
    purposes: ['usage']
  },
  {
    cookies: ['i18n_locale_code'],
    name: 'i18n',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: [/^_pk_/, 'mtm_cookie_consent'],
    name: 'matomo',
    purposes: ['usage']
  },
  {
    cookies: ['new_feature_notification'],
    name: 'newFeatureNotification',
    purposes: ['essential'],
    required: true
  },
  {
    cookies: ['searchResultsView'],
    name: 'searchResultsView',
    purposes: ['essential'],
    required: true
  },
  { name: 'facebook', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'googleDocs', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'googleDrive', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'instagram', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'mailchimp', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'pinterest', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'wheeldecide', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'x', purposes: ['thirdPartyContent', 'socialMedia'] },
  { name: 'bookWidgets', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'ecorpus', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'gallica', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'gettyImages', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'institutNationalDeLAudiovisuel',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://www.ina.fr/video/*',
      'http://www.ina.fr/*/video/*'
    ],
    purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'internetCulturale', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'nakala', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'openbeelden', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'serveiDeGestioDocumentalArxius', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'sokINettbiblioteket', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'theCyprusInstitute', purposes: ['thirdPartyContent', 'mediaViewing', '2D'] },
  { name: 'arctur3DViewer', purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'eureka3D',
    oembed: 'https://eureka3d.vm.fedcloud.eu/oembed',
    schemes: [
      'https://eureka3d.vm.fedcloud.eu/3d/*'
    ], purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'gotlandPictureStones', purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'sketchfab',
    oembed: 'https://sketchfab.com/oembed',
    schemes: [
      'https://sketchfab.com/3d-models/*',
      'https://sketchfab.com/models/*',
      'https://sketchfab.com/show/*'
    ], purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'spatial', purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'weave',
    oembed: 'https://weave-3dviewer.com/api/core/v1/oembed',
    schemes: [
      'https://weave-3dviewer.com/asset/*'
    ], purposes: ['thirdPartyContent', 'mediaViewing', '3D'] },
  { name: 'britishLibrarySounds', purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'buzzsprout', purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'freesound', purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'phonobase', purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'soundArchivesOfTheCNRS',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://archives.crem-cnrs.fr/archives/items/*/'
    ],
    purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'soundCloud',
    oembed: 'https://soundcloud.com/oembed',
    schemes: ['http://soundcloud.com/*', 'https://soundcloud.com/*'],
    purposes: ['thirdPartyContent', 'mediaViewing', 'audio'] },
  { name: 'archiveOrg', purposes: ['thirdPartyContent', 'mediaViewing', 'multimedia'] },
  { name: 'digitalRepositoryOfIreland', purposes: ['thirdPartyContent', 'mediaViewing', 'multimedia'] },
  { name: 'deutschesFilmportal', purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'eclap', purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'europeanParliamentMultimediaService', purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'euscreen',
    oembed: 'https://oembed.euscreen.eu/services/oembed',
    schemes: [
      'http://www.euscreen.eu/item.html*',
      'https://www.euscreen.eu/item.html*'
    ], purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'myminifactory', purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'tibAvPortal', purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'tv3',
    oembed: 'https://oembed.europeana.eu/',
    schemes: [
      'http://www.ccma.cat/tv3/alacarta/programa/titol/video/*/'
    ],
    purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'vimeo',
    oembed: 'https://vimeo.com/api/oembed.json',
    schemes: [
      'https://vimeo.com/*',
      'https://vimeo.com/album/*/video/*',
      'https://vimeo.com/channels/*/*',
      'https://vimeo.com/groups/*/videos/*',
      'https://vimeo.com/ondemand/*/*',
      'https://player.vimeo.com/video/*',
      'http://vimeo.com/*',
      'http://vimeo.com/album/*/video/*',
      'http://vimeo.com/channels/*/*',
      'http://vimeo.com/groups/*/videos/*',
      'http://vimeo.com/ondemand/*/*',
      'http://player.vimeo.com/video/*'
    ],
    purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'youTube',
    oembed: 'https://www.youtube.com/oembed',
    schemes: [
      'https://youtube.com/watch*',
      'https://youtube.com/v/*',
      'https://www.youtube.com/watch*',
      'https://www.youtube.com/v/*',
      'https://youtu.be/*'
    ],
    purposes: ['thirdPartyContent', 'mediaViewing', 'video'] },
  { name: 'albinLarsson', purposes: ['thirdPartyContent', 'other'] },
  { name: 'behance', purposes: ['thirdPartyContent', 'other'] },
  { name: 'carto', purposes: ['thirdPartyContent', 'other'] },
  { name: 'codepen', purposes: ['thirdPartyContent', 'other'] },
  { name: 'datawrapper', purposes: ['thirdPartyContent', 'other'] },
  { name: 'exhibit', purposes: ['thirdPartyContent', 'other'] },
  { name: 'gfycat', purposes: ['thirdPartyContent', 'other'] },
  { name: 'giphy', purposes: ['thirdPartyContent', 'other'] },
  { name: 'googleMaps', purposes: ['thirdPartyContent', 'other'] },
  { name: 'humap', purposes: ['thirdPartyContent', 'other'] },
  { name: 'jigsawplanet', purposes: ['thirdPartyContent', 'other'] },
  { name: 'knightLabCdn', purposes: ['thirdPartyContent', 'other'] },
  { name: 'kystreise', purposes: ['thirdPartyContent', 'other'] },
  { name: 'myAdventCalendar', purposes: ['thirdPartyContent', 'other'] },
  { name: 'onlineComputerLibraryCenter', purposes: ['thirdPartyContent', 'other'] },
  { name: 'prezi', purposes: ['thirdPartyContent', 'other'] },
  { name: 'slidebean', purposes: ['thirdPartyContent', 'other'] },
  { name: 'universityOfCaliforniaSanDiego', purposes: ['thirdPartyContent', 'other'] },
  { name: 'wikidata', purposes: ['thirdPartyContent', 'other'] },
  { name: 'woobox', purposes: ['thirdPartyContent', 'other'] }
];

export default services;
