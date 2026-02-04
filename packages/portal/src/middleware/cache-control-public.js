export default ({ res }) => {
  if (process.server && res) {
    res.removeHeader('Cache-Control');
    // permit caching, but require revalidation e.g. by etag or last-modified
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
};
