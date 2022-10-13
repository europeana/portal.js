// Remove legacy /portal prefix

export default (req) => {
  const pattern = /^\/portal(\/.*)$/;

  const match = req.path.match(pattern);
  return match ? { path: match[1] } : null;
};
