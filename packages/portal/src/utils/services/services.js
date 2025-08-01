const definitions = {
  '2D': require('./definitions/2D.json'),
  '3D': require('./definitions/3D.json'),
  audio: require('./definitions/audio.json'),
  multimedia: require('./definitions/multimedia.json'),
  other: require('./definitions/other.json'),
  portal: require('./definitions/portal.json'),
  socialMedia: require('./definitions/socialMedia.json'),
  video: require('./definitions/video.json')
};

const parseDefinitions = (purpose) => definitions[purpose]
  .map((service) => {
    if (!service.purposes) {
      service.purposes = [purpose];
    }
    if (service.cookies) {
      service.cookies = [].concat(service.cookies).map((cookie) => new RegExp(cookie));
    }
    return service;
  });

const mediaViewingServices = [
  ...parseDefinitions('2D'),
  ...parseDefinitions('3D'),
  ...parseDefinitions('audio'),
  ...parseDefinitions('multimedia'),
  ...parseDefinitions('video')
]
  .map((service) => ({ ...service, purposes: ['mediaViewing', ...service.purposes] }));

const thirdPartyServices = [
  ...parseDefinitions('socialMedia'),
  ...mediaViewingServices,
  ...parseDefinitions('other')
]
  .map((service) => ({ ...service, purposes: ['thirdPartyContent', ...service.purposes] }));

export default [...parseDefinitions('portal'), ...thirdPartyServices];
