// Redirect legacy record page URLs

export default (req) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/record(\/.*?)(\.html)?$/;
  const match = req.path.match(pattern);

  return match ? {
    path: [
      match[1],
      '/item',
      match[2]
    ]
  } : null;
};
