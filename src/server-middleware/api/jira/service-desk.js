const axios = require('axios');

const JIRA_SERVICE_DESK_API_PATH = '/rest/servicedeskapi/request';
const JSON_CONTENT_TYPE = 'application/json';

const jiraData = (options, req) => {
  const data = {
    serviceDeskId: options.serviceDesk.serviceDeskId,
    requestTypeId: options.serviceDesk.requestTypeId,
    requestFieldValues: {
      summary: req.body.summary,
      'customfield_10809': req.body.pageUrl,
      'customfield_10810': req.body.browser,
      'customfield_10811': req.body.screensize
    }
  };
  if (req.body.email) {
    data.raiseOnBehalfOf = req.body.email;
  }
  return data;
};

const jiraOptions = options => ({
  auth: {
    username: options.username,
    password: options.password
  },
  headers: {
    'Accept': JSON_CONTENT_TYPE,
    'Content-Type': JSON_CONTENT_TYPE
  }
});

module.exports = (options = {}) => (req, res) => {
  // Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
  return axios
    .create({ baseURL: options.origin })
    .post(JIRA_SERVICE_DESK_API_PATH, jiraData(options, req), jiraOptions(options))
    .then(jiraRes => {
      res.sendStatus(jiraRes.status);
    }).catch(error => {
      if (error.response) {
        res.status(error.response.status).set('Content-Type', 'text/plain').send(error.response.data.errorMessage);
      } else {
        res.status(500).set('Content-Type', 'text/plain').send(error.message);
      }
    });
};
