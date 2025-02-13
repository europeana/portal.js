import createHttpError from 'http-errors';

export default function assertAvailable(api) {
  if (api.config.unavailable) {
    throw new Error(createHttpError(503));
  }
}
