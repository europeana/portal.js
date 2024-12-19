export default {
  data() {
    return {
      klaroAllServices: this.$features.embeddedMediaNotification ? portalServices.concat(thirdPartyServices) : portalServices
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
].map(service => ({ ...service, subPurpose: 'socialMedia' }));

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
].map(service => ({ ...service, subGroup: '2D' }));

const mediaViewingServices = twoDServices.map(service => ({ ...service, subPurpose: 'mediaViewing' }));

const thirdPartyServices = socialMediaServices.concat(mediaViewingServices).map(service => ({ ...service, purposes: ['thirdPartyContent'] }));
