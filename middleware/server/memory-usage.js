export default (req, res) => {
  res.json(process.memoryUsage());
};
