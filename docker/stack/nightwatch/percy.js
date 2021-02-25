// Config file for Percy
// Doc: https://docs.percy.io/docs/sdk-configuration
module.exports = {
  'version': 1,

  'agent': {
    'asset-discovery': {
      'allowed-hostnames': [
        'fonts.gstatic.com',
        'images.ctfassets.net',
        'unpkg.com'
      ]
    },
    'network-idle-timeout': 1000
  }
};
