// Outputs as plain text the version of the app that is running
import pkg from '../../../package.json';
export default (req, res) => res.send(pkg.version);
