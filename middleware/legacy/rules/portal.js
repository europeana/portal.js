// Remove legacy /portal prefix

export default (route) => {
  const pattern = /^\/portal(\/.*)$/;

  const match = route.path.match(pattern);
  return match ? { path: match[1] } : null;
};
