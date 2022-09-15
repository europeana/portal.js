const DEFAULT_ROBOTS_TXT = 'User-agent: *\nAllow: /';

export default (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end(process.env.ROBOTS_TXT || DEFAULT_ROBOTS_TXT);
};
