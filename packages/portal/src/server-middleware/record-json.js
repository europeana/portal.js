export default (req, res, next) => {
  const urlMatch = req.url.match(/^\/[a-z]{2}\/item(\/[^/]+\/[^/]+)\.json$/);
  if (urlMatch) {
    const location = req.url.replace(/\.json$/, '#api-requests');
    res.writeHead(302, { location });
    res.end();
  } else {
    next();
  }
};
