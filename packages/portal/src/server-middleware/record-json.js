export default (req, res, next) => {
  if (req.url.endsWith('.json') && req.url.includes('/item/')) {
    const location = req.url.slice(0, -5) + '#api-requests';
    res.writeHead(302, { location });
    res.end();
  } else {
    next();
  }
};
