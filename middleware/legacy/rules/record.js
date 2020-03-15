// Redirect legacy record page URLs

export default (route) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/record(\/.*?)(\.html)?$/;
  const match = route.path.match(pattern);

  return match ? {
    path: [
      match[1],
      '/item',
      match[2]
    ]
  } : null;
};
