// Remove .html suffix

export default (route) => {
  const pattern = /^\/portal(\/.+)\.html$/;
  const match = route.path.match(pattern);

  return match ? {
    path: match.slice(1)
  } : null;
};
