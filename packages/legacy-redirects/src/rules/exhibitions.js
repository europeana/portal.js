// Redirect legacy exhibition page URLs

export default (req) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/exhibitions(\/.+)$/;
  const match = req.path.match(pattern);

  return match && (match[2] !== '/foyer') ? {
    path: [
      match[1],
      '/exhibitions',
      match[2]
    ]
  } : null;
};
