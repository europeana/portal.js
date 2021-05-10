// Redirect legacy gallery page URLs

export default (route) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/explore\/galleries(\/.+)$/;
  const match = route.path.match(pattern);

  return match ? {
    path: [
      match[1],
      '/galleries',
      match[2]
    ]
  } : null;
};
