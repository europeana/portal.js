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

const otherServices = require('./definitions/other.json')
  .map((service) => ({ ...service, purposes: ['other'] }));

const thirdPartyServices = [...socialMediaServices, ...mediaViewingServices, ...otherServices]
  .map((service) => ({ ...service, purposes: ['thirdPartyContent', ...service.purposes] }));

export default portalServices.concat(thirdPartyServices);
