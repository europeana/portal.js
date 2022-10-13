// Redirect legacy gallery page URLs

export default (req) => {
  const pattern = /^\/portal(\/[a-z]{2})?\/explore\/(newcontent|colours|sources|topics|people|periods)(\.html)?$/;
  const match = req.path.match(pattern);

  return match ? {
    path: [
      match[1],
      '/collections'
    ],
    status: 302
  } : null;
};
