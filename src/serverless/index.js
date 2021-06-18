const cli = {
  harvest: {
    organisations: require('./harvest/organisations')
  }
};

const main = () => {
  return cli[process.argv[2]][process.argv[3]].cli();
};

main()
  .then(({ message }) => {
    console.log(`SUCCESS: ${message}`);
    process.exit();
  })
  .catch(({ message }) => {
    console.log(`ERROR: ${message}`);
    process.exit(1);
  });
