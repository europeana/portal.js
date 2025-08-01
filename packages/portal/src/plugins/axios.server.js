import axios from 'axios';
import http from 'http';
import https from 'https';

let httpAgent;
let httpsAgent;

export default () => {
  if (!httpAgent) {
    httpAgent = new http.Agent({ keepAlive: true });
    axios.defaults.httpAgent = httpAgent;
  }

  if (!httpsAgent) {
    httpsAgent = new https.Agent({ keepAlive: true });
    axios.defaults.httpsAgent = httpsAgent;
  }
};
