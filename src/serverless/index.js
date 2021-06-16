const cli = {
  harvest: {
    organisations: require('./harvest/organisations')
  }
};

cli[process.argv[2]][process.argv[3]].main();
