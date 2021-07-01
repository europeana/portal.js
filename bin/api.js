import app from '../src/server-middleware/api';
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}/`);
});
