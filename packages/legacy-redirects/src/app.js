// import config from './config.js';

import redirect from './redirect.js';

// const runtimeConfig = config();

export default (app) => {
  app.get('/portal/*', (req, res) => redirect(req, res));

  return app;
};
