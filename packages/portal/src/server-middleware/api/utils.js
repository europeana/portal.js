import apm from 'elastic-apm-node';
import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err) {
    console.error(process.NODE_ENV === 'production' ? err.message : err.stack);

    const errorStatus = err.response?.status || err.status || err.statusCode || 500;
    const message = err.response?.data?.error || err.response?.data?.errorMessage || err.message;

    if (apm.isStarted()) {
      apm.captureError(err, { message, request: req, response: res });
    }

    if (!res.writableEnded) {
      res.status(errorStatus).send(message);
    }
  } else {
    next();
  }
};

export const forbiddenUnlessOriginAllowed = (origins) => (origin, callback) => {
  if (origins.includes(origin)) {
    callback(null, true);
  } else {
    callback(createHttpError(403, 'Origin not permitted'));
  }
};
