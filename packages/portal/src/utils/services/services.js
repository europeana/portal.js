const portalServices = require('./definitions/portal.json');

const socialMediaServices = require('./definitions/socialMedia.json')
  .map((service) => ({ ...service, purposes: ['socialMedia'] }));

const twoDServices = require('./definitions/2D.json')
  .map((service) => ({ ...service, purposes: ['2D'] }));

const threeDServices = require('./definitions/3D.json')
  .map((service) => ({ ...service, purposes: ['3D'] }));

const audioServices = require('./definitions/audio.json')
  .map((service) => ({ ...service, purposes: ['audio'] }));

const multimediaServices = require('./definitions/multimedia.json')
  .map((service) => ({ ...service, purposes: ['multimedia'] }));

const videoServices = require('./definitions/video.json')
  .map((service) => ({ ...service, purposes: ['video'] }));

const mediaViewingServices = [].concat(twoDServices, threeDServices, audioServices, multimediaServices, videoServices)
  .map((service) => ({ ...service, purposes: ['mediaViewing', ...service.purposes] }));

const otherEmbeddingServices = [
  { name: 'albinLarsson',
    schemes: ['https://byabbe.se/*'] },
  { name: 'behance',
    schemes: [
      'https://www.behance.net/embed/*'
    ] },
  { name: 'codepen',
    schemes: [
      'https://codepen.io/*/embed/*'
    ] },
  { name: 'datawrapper',
    schemes: [
      'http://datawrapper.dwcdn.net/*'
    ] },
  { name: 'giphy',
    schemes: [
      'http://giphy.com/embed/*',
      'https://giphy.com/embed/*'
    ] },
  { name: 'humap',
    schemes: [
      'https://*.humap.site/*'
    ] },
  { name: 'jigsawplanet',
    schemes: [
      'https://www.jigsawplanet.com/?rc=play&pid=*'
    ] },
  { name: 'kulturLandBilder',
    schemes: [
      'https://kartographie.leibniz-ifl-projekte.de/*'
    ] },
  { name: 'kystreise',
    schemes: [
      'https://rs.kystreise.no/filestore/*'
    ] },
  { name: 'myAdventCalendar',
    schemes: [
      'https://app.myadvent.net/calendar?id=*',
      'https://calendar.myadvent.net/?id=*'
    ] },
  { name: 'prezi',
    schemes: [
      'https://prezi.com/embed/*'
    ] },
  { name: 'slidebean',
    schemes: [
      'http://slidebean.com/embed/*'
    ] },
  { name: 'tmaticTravel',
    schemes: [
      'https://tmatic.travel/en/view/activity/*'
    ] },
  { name: 'universityOfCaliforniaSanDiego',
    schemes: [
      'https://pointcloud.ucsd.edu/*'
    ] },
  { name: 'wikidata',
    schemes: [
      'https://query.wikidata.org/*'
    ] },
  { name: 'woobox',
    schemes: [
      'https://woobox.com/js/plugins/woo.js'
    ] }
].map(service => ({ ...service, purposes: ['other'] }));

const thirdPartyServices = [...socialMediaServices, ...mediaViewingServices, ...otherEmbeddingServices]
  .map(service => ({ ...service, purposes: ['thirdPartyContent', ...service.purposes] }));

export default portalServices.concat(thirdPartyServices);
