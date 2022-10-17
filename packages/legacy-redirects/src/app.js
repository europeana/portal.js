import redirect from './redirect.js';

export default (app) => {
  app.get('/portal/*', (req, res) => redirect(req, res));

  return app;
};
