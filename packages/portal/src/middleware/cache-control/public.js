export default ({ $auth, res }) => {
  if (process.server && !$auth?.loggedIn) {
    res.removeHeader('Cache-Control');
    // // permit caching, but require revalidation e.g. by etag or last-modified
    // res.setHeader('Cache-Control', 'public');
    // let downstream proxy determine how long to cache for
    res.setHeader('Cache-Control', 'public');
  }
};
