import httpError from 'http-errors';

export function apiError(error) {
  let statusCode = 500;
  let message = error.message;

  if (error.response) {
    statusCode = error.response.status;
    message = error.response.data.error;
  }

  return httpError(statusCode, message);
}
