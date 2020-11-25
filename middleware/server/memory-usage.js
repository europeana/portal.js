export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(process.memoryUsage()));
};
