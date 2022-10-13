// Redirect legacy gallery page URLs

export default (req) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/explore\/galleries(\/.+)$/;
  const match = req.path.match(pattern);

  return match ? {
    path: [
      match[1],
      '/galleries',
      match[2]
    ]
  } : null;
};
