const express = require('express');
const app = express();

app.use(express.json());

app.get('/debug/memory-usage', require('./debug/memory-usage'));

app.post('/jira/service-desk', require('./jira/service-desk')({
  origin: process.env.JIRA_API_ORIGIN,
  serviceDeskId: process.env.JIRA_API_SERVICE_DESK_ID,
  requestTypeId: process.env.JIRA_API_REQUEST_TYPE_ID,
  username: process.env.JIRA_API_USERNAME,
  password: process.env.JIRA_API_PASSWORD
}));

app.all('/*', (req, res) => res.sendStatus(404));

export default app;
