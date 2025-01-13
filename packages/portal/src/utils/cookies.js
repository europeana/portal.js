// TODO: Filter and reuse list for oembed/providers.js as schemes are duplicate
const portalServices = [
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
  }
];

const socialMediaServices = [
  { name: 'facebook' },
  { name: 'googleDocs' },
  { name: 'googleDrive' },
  { name: 'instagram' },
  { name: 'mailchimp' },
  { name: 'pinterest' },
  { name: 'wheeldecide' },
  { name: 'x' }
].map(service => ({ ...service, subPurpose: 'socialMedia' }));

const twoDServices = [
  { name: 'bookWidgets' },
  { name: 'ecorpus' },
  { name: 'gallica' },
  { name: 'gettyImages' },
  { name: 'institutNationalDeLAudiovisuel',
    schemes: [
      'http://www.ina.fr/video/*',
      'http://www.ina.fr/*/video/*'
    ] },
  { name: 'internetCulturale' },
  { name: 'nakala' },
  { name: 'openbeelden' },
  { name: 'serveiDeGestioDocumentalArxius' },
  { name: 'sokINettbiblioteket' },
  { name: 'theCyprusInstitute' }
].map(service => ({ ...service, subGroup: '2D' }));

const threeDServices = [
  { name: 'arctur3DViewer' },
  { name: 'eureka3D',
    schemes: [
      'https://eureka3d.vm.fedcloud.eu/3d/*'
    ] },
  { name: 'gotlandPictureStones' },
  { name: 'sketchfab',
    schemes: [
      'https://sketchfab.com/3d-models/*',
      'https://sketchfab.com/models/*',
      'https://sketchfab.com/show/*'
    ] },
  { name: 'spatial' },
  { name: 'weave',
    schemes: [
      'https://weave-3dviewer.com/asset/*'
    ] }
].map(service => ({ ...service, subGroup: '3D' }));

const audioServices = [
  { name: 'britishLibrarySounds' },
  { name: 'buzzsprout' },
  { name: 'freesound' },
  { name: 'phonobase' },
  { name: 'soundArchivesOfTheCNRS',
    schemes: [
      'http://archives.crem-cnrs.fr/archives/items/*/'
    ] },
  { name: 'soundCloud',
    schemes: ['http://soundcloud.com/*', 'https://soundcloud.com/*'] }
].map(service => ({ ...service, subGroup: 'audio' }));

const multimediaServices = [
  { name: 'archiveOrg' },
  { name: 'digitalRepositoryOfIreland' }
].map(service => ({ ...service, subGroup: 'multimedia' }));

const videoServices = [
  { name: 'deutschesFilmportal' },
  { name: 'eclap' },
  { name: 'europeanParliamentMultimediaService' },
  { name: 'euscreen',
    schemes: [
      'http://www.euscreen.eu/item.html*',
      'https://www.euscreen.eu/item.html*'
    ] },
  { name: 'myminifactory' },
  { name: 'tibAvPortal' },
  { name: 'tv3',
    schemes: [
      'http://www.ccma.cat/tv3/alacarta/programa/titol/video/*/'
    ] },
  { name: 'vimeo',
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
    ] },
  { name: 'youTube',
    schemes: [
      'https://youtube.com/watch*',
      'https://youtube.com/v/*',
      'https://www.youtube.com/watch*',
      'https://www.youtube.com/v/*',
      'https://youtu.be/*'
    ] }
].map(service => ({ ...service, subGroup: 'video' }));

const mediaViewingServices = twoDServices.concat(threeDServices, audioServices, multimediaServices, videoServices)
  .map(service => ({ ...service, subPurpose: 'mediaViewing' }));

const otherEmbeddingServices = [
  { name: 'albinLarsson' },
  { name: 'behance' },
  { name: 'carto' },
  { name: 'codepen' },
  { name: 'datawrapper' },
  { name: 'exhibit' },
  { name: 'gfycat' },
  { name: 'giphy' },
  { name: 'googleMaps' },
  { name: 'humap' },
  { name: 'jigsawplanet' },
  { name: 'knightLabCdn' },
  { name: 'kystreise' },
  { name: 'myAdventCalendar' },
  { name: 'onlineComputerLibraryCenter' },
  { name: 'prezi' },
  { name: 'slidebean' },
  { name: 'universityOfCaliforniaSanDiego' },
  { name: 'wikidata' },
  { name: 'woobox' }

].map(service => ({ ...service, subPurpose: 'other' }));

const thirdPartyServices = socialMediaServices.concat(mediaViewingServices, otherEmbeddingServices)
  .map(service => ({ ...service, purposes: ['thirdPartyContent'] }));

export default portalServices.concat(thirdPartyServices);
