export default ({ res }) => {
  res?.removeHeader('Cache-Control');
  // cache for one hour
  // res?.setHeader('Cache-Control', 'public, max-age=3600');
  // permit public caching, but require revalidation e.g. by etag or last-modified
  // res.setHeader('Cache-Control', 'public, max-age=0');
  // let downstream proxy determine how long to cache for
  res?.setHeader('Cache-Control', 'public');
};
