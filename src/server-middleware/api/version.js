console.log('require.main.filename', require.main.filename);
module.exports = (req, res) => res.send(require('../../../package').version);
