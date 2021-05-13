const axios = require('axios');

const jiraUrl = options => `${options.origin}/rest/servicedeskapi/request`;

const jiraData = (options, req) => {
  const data = {
    serviceDeskId: options.serviceDeskId,
    requestTypeId: options.requestTypeId,
    requestFieldValues: {
      summary: req.body.summary
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
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// TODO: limit CORS origins
module.exports = (options = {}) => (req, res) => {
  // Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
  return axios.post(jiraUrl(options), jiraData(options, req), jiraOptions(options))
    .then(jiraRes => {
      res.sendStatus(jiraRes.status);
    }).catch(error => {
      if (error.response) {
        res.status(error.response.status).set('Content-Type', 'text/plain').send(error.response.data.errorMessage);
      } else {
        res.status(500).set('Content-Type', 'text/plain').send(error);
      }
    });
};
