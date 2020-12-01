export default (req, res) => {
  res.json(require('../../package').version);
};
