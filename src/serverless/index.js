const cli = {
  harvest: {
    organisations: require('./harvest/organisations')
  }
};

const main = () => {
  cli[process.argv[2]][process.argv[3]].main();
};

main();
