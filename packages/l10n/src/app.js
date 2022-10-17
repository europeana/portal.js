import cookieParser from 'cookie-parser';

import redirect from './redirect.js';

export default (app) => {
  app.use(cookieParser());
  app.get('/*', (req, res) => redirect(req, res));

  return app;
};
