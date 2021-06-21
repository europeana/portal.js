if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cli = {
  'entities:organisations:fetch': require('./entities/organisations/fetch'),
  'entities:organisations:harvest': require('./entities/organisations/harvest')
};

const main = () => {
  return cli[process.argv[2]].cli();
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
