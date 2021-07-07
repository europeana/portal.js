// Outputs as plain text the version of the app that is running
module.exports = (req, res) => res.send(require('../../../package').version);
