// Outputs as plain text the version of the app that is running
export default (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end(process.env.npm_package_version);
};
