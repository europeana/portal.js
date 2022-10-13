import express from 'express';
import apm from 'elastic-apm-node';
import morgan from 'morgan';

export default (callback) => {
  const app = express();
  app.disable('x-powered-by'); // Security: do not disclose technology fingerprints
  app.use(express.json());
  app.use(morgan('combined')); // Use morgan for request logging

  app.use((req, res, next) => {
    // TODO: configure and start APM somewhere...
    //       (framework should be express, service name should be configurable)
    if (apm.isStarted())  {
      // Elastic APM Node agent instruments Express requests automatically, but
      // omits any prefix such as /_api/, so override the transactions name here
      // to restore it form the original URL.
      apm.setTransactionName(`${req.method} ${req.originalUrl.split('?')[0]}`);
    }
    next();
  });

  if (typeof callback === 'function') {
    callback(app);
  }

  app.all('/*', (req, res) => res.sendStatus(404));

  return app;
};
