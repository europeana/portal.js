// Outputs as plain text the version of the app that is running
import { version } from '../../../package.json';

export default (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end(version);
};
