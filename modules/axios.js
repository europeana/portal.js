import https from 'https';
import axios from 'axios';

export default function() {
  const permitUnauthorized = Number(process.env.AXIOS_PERMIT_UNAUTHORIZED_HTTPS) ||
    process.env.NODE_ENV === 'test';

  axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: !permitUnauthorized });
}
