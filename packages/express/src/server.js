export default (app) => {
  const server = app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port ' + server.address().port);
  });
  return server;
};
