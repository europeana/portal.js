/* eslint-disable camelcase */

module.exports = {
  apps: [
    {
      name: 'portal.js',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      combine_logs: true
    }
  ]
};
