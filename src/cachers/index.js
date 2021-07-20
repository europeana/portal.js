if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const commands = [
  'entities:organisations'
];

const cli = commands.reduce((memo, command) => {
  const commandPath = command.replace(/:/g, '/');
  memo[command] = require(`./${commandPath}`);
  return memo;
}, {});

const main = () => {
  return cli[process.argv[2]].cli(process.argv[3]);
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
