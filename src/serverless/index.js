const cli = {
  'entities:organisations:fetch': require('./entities/organisations/fetch'),
  'entities:organisations:harvest': require('./entities/organisations/harvest')
};

const main = () => {
  return cli[process.argv[2]].cli();
};

main()
  .then(({ body }) => {
    console.log(`SUCCESS: ${body}`);
    process.exit(0);
  })
  .catch(({ body }) => {
    console.log(`ERROR: ${body}`);
    process.exit(1);
  });
