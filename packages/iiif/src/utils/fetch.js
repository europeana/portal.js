import axios from 'axios';

import { isForEuropeanaPresentationManifest } from '../utils/url.js';

export default (url, options = {}) => {
  // if (isForEuropeanaPresentationManifest(url)) {
  //   if (!options.headers) {
  //     options.headers = {};
  //   }
  //   // NOTE: it would be preferable to do this with all requests, but some providers
  //   //       CORS support do not permit the Accept header, preventing the manifest
  //   //       loading
  //   options.headers['Accept'] = (
  //     'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json";q=1.0, application/ld+json;profile="http://iiif.io/api/presentation/2/context.json";q=0.9, application/ld+json;q=0.8, application/json;q=0.7'
  //   );
  // }
  return axios.get(url, options);
};
