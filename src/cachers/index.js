if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const defu = require('defu');
const nuxtConfig = require('../../nuxt.config');
const runtimeConfig = defu(nuxtConfig.privateRuntimeConfig, nuxtConfig.publicRuntimeConfig);

const commands = [
  'entities:organisations:get',
  'entities:organisations:set',
  'items:recent:get',
  'items:recent:set'
];

const cli = commands.reduce((memo, command) => {
  const commandPath = command.replace(/:/g, '/');
  // TODO: lazy-require just the script for command called
  memo[command] = require(`./${commandPath}`);
  return memo;
}, {});

const main = () => {
  return cli[process.argv[2]](runtimeConfig, process.argv.slice(3));
};

main()
  .then(({ body }) => {
    if (typeof body === 'string') {
      console.log(`SUCCESS: ${body}`);
    } else {
      console.log('SUCCESS:');
      console.log(JSON.stringify(body, null, 2));
    }
    process.exit(0);
  })
  .catch(({ body }) => {
    console.log(`ERROR: ${body}`);
    process.exit(1);
  });
