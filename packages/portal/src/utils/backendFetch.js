import axios from 'axios';

export const backendFetch = ({ http, module } = {}, context = {}) => {
  console.log('backendFetch', http, module);
  if (process.server) {
    return module.import()
      .then((importedModule) => importedModule[module.fn].apply(null, module.args));
  } else  {
    return axios.request({
      baseURL: context.$config.app.baseUrl,
      ...http
    })
      .then((response) => response.data);
  }
};
