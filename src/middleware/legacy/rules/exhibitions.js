// Redirect legacy exhibition page URLs

export default (route) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/exhibitions(\/.+)$/;
  const match = route.path.match(pattern);

  return match && (match[2] !== '/foyer') ? {
    path: [
      match[1],
      '/exhibitions',
      match[2]
    ]
  } : null;
};
