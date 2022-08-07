import cacher from './index.js';

cacher(process.argv[2], process.argv[3])
  .then(message => {
    console.log(message);
    process.exit(0);
  })
  .catch(message => {
    console.error(`ERROR: ${message}`);
    process.exit(1);
  });
