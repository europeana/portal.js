const paths = require('./paths.json');
const axios = require('axios');

for (const path of paths) {
  axios.get(`http://localhost:4000${path}`)
    .then(() => {
      console.log(`${path} OK`);
    })
    .catch((error) => {
      console.log(`${path} ERROR`, error.toString());
    });
}
