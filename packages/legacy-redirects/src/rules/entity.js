// Redirect legacy entity page URLs

export default (req) => {
  const pattern = /^\/portal(\/[a-z]{2})?(\/explore\/(people|topics|periods))(\/[0-9]+)/;
  const match = req.path.match(pattern);

  return match ? {
    path: [
      match[1],
      match[2].replace('/explore', '/collections').replace('/people', '/person').replace('/topics', '/topic').replace('/periods', '/time'),
      match[4]
    ]
  } : null;
};
