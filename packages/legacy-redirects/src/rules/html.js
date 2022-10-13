// Remove .html suffix

export default (req) => {
  const pattern = /^\/portal(\/.+)\.html$/;
  const match = req.path.match(pattern);

  return match ? {
    path: match.slice(1)
  } : null;
};
