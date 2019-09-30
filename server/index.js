const consola = require('consola');

const vcapApplication = process.env.VCAP_APPLICATION ? JSON.parse(process.env.VCAP_APPLICATION) : {};
// Remove "-new" from app name resulting from blue/green deployment
const vcapApplicationName = vcapApplication.name ? vcapApplication.name.replace(/-new$/, '') : null;

const vcapServices = require('vcap_services');
const elasticApmCredentials = vcapServices.getCredentials('user-provided', null, 'elastic-apm');

if (elasticApmCredentials.server_url) {
  consola.info(`Using Elastic APM at ${elasticApmCredentials.server_url}`);
  require('elastic-apm-node').start({
    serviceName: vcapApplicationName || 'portaljs',
    secretToken: elasticApmCredentials.secret_token,
    serverUrl: elasticApmCredentials.server_url,
    frameworkName: 'Nuxt.js',
    frameworkVersion: require('nuxt/package.json').version,
    serviceVersion: require('../package.json').version
  });
}

const express = require('express');
const morgan = require('morgan');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);
  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  if (process.env.NODE_ENV !== 'test') {
    // Use morgan for request logging
    app.use(morgan('combined'));

    // IP access retriction
    if (process.env.IP_FILTER_ALLOW) {
      consola.info(`Restricting access to IPs: ${process.env.IP_FILTER_ALLOW}`);
      const ipfilter = require('express-ipfilter').IpFilter;
      const allowIps = process.env.IP_FILTER_ALLOW.split(' ');
      let ipfilterOptions = { mode: 'allow' };
      if (process.env.IP_FILTER_TRUST_PROXY) {
        consola.info(`Trusting proxy: ${process.env.IP_FILTER_TRUST_PROXY}`);
        ipfilterOptions.trustProxy = process.env.IP_FILTER_TRUST_PROXY.split(' ');
      }
      app.use(ipfilter(allowIps, ipfilterOptions));
    }

    // HTTP Digest authentication
    if (process.env.HTTP_DIGEST_REALM && process.env.HTTP_DIGEST_ACL) {
      consola.info('HTTP Digest authentication enabled');

      const acl = JSON.parse(process.env.HTTP_DIGEST_ACL);
      const realm = process.env.HTTP_DIGEST_REALM;

      const crypto = require('crypto');
      const httpAuth = require('http-auth');

      const digest = httpAuth.digest({
        realm
      }, (username, callback) => {
        consola.info(`Authenticating username "${username}" in realm "${realm}"`);

        const credentials = acl.find((account) => {
          return account.username === username;
        }) || {};

        // Callback expects md5(username:realm:password)
        const htdigest = `${credentials.username}:${realm}:${credentials.password}`;
        let hash = crypto.createHash('MD5');
        hash.update(htdigest);

        callback(hash.digest('hex'));
      });

      app.use(httpAuth.connect(digest));
    }

    if (!process.env.DISABLE_REDIRECT_SSL) {
      const redirectSSL = require('redirect-ssl');
      app.use(redirectSSL.create({ redirect: true }));
    }
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
