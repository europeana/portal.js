export default {
  data() {
    return {
      klaroAllServices: this.$features.embeddedMediaNotification ? [...portalServices, ...thirdPartyServices] : portalServices
    };
  }
};

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
].map(service => ({ ...service, purposes: ['socialMedia'] }));

const twoDServices = [
  { name: 'bookWidgets' },
  { name: 'ecorpus' },
  { name: 'gallica' },
  { name: 'gettyImages' },
  { name: 'institutNationalDeLAudiovisuel' },
  { name: 'internetCulturale' },
  { name: 'nakala' },
  { name: 'openbeelden' },
  { name: 'serveiDeGestioDocumentalArxius' },
  { name: 'sokINettbiblioteket' },
  { name: 'theCyprusInstitute' }
].map(service => ({ ...service, purposes: ['2D'] }));

const threeDServices = [
  { name: 'arctur3DViewer' },
  { name: 'eureka3D' },
  { name: 'gotlandPictureStones' },
  { name: 'sketchfab' },
  { name: 'spatial' },
  { name: 'weave' }
].map(service => ({ ...service, purposes: ['3D'] }));

const audioServices = [
  { name: 'britishLibrarySounds' },
  { name: 'buzzsprout' },
  { name: 'freesound' },
  { name: 'phonobase' },
  { name: 'soundArchivesOfTheCNRS' },
  { name: 'soundCloud' }
].map(service => ({ ...service, purposes: ['audio'] }));

const multimediaServices = [
  { name: 'archiveOrg' },
  { name: 'digitalRepositoryOfIreland' }
].map(service => ({ ...service, purposes: ['multimedia'] }));

const videoServices = [
  { name: 'deutschesFilmportal' },
  { name: 'eclap' },
  { name: 'europeanParliamentMultimediaService' },
  { name: 'euscreen' },
  { name: 'myminifactory' },
  { name: 'tibAvPortal' },
  { name: 'vimeo' },
  { name: 'youTube' }
].map(service => ({ ...service, purposes: ['video'] }));

const mediaViewingServices = twoDServices.concat(threeDServices, audioServices, multimediaServices, videoServices)
  .map(service => ({ ...service, purposes: ['mediaViewing', ...service.purposes] }));

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
].map(service => ({ ...service, purposes: ['other'] }));

const thirdPartyServices = [...socialMediaServices, ...mediaViewingServices, ...otherEmbeddingServices]
  .map(service => ({ ...service, purposes: ['thirdPartyContent', ...service.purposes] }));
