import axios from 'axios';

import { truncate } from '../../../plugins/vue-filters';

const JIRA_SERVICE_DESK_API_PATH = '/rest/servicedeskapi/request';
const JSON_CONTENT_TYPE = 'application/json';

const jiraData = (options, req) => {
  const { customFields } = options.serviceDesk;
  const data = {
    serviceDeskId: options.serviceDesk.serviceDeskId,
    requestTypeId: options.serviceDesk.requestTypeId,
    requestFieldValues: {
      summary: truncate(req.body.feedback, 50),
      description: req.body.feedback
    }
  };
  if (customFields) {
    if (customFields.pageUrl && req.body.pageUrl) {
      data.requestFieldValues[customFields.pageUrl] = req.body.pageUrl;
    }
    if (customFields.browser && req.body.browser) {
      data.requestFieldValues[customFields.browser] = req.body.browser;
    }
    if (customFields.screensize && req.body.screensize) {
      data.requestFieldValues[customFields.screensize] = req.body.screensize;
    }
  }
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

export default (options = {}) => (req, res) => {
  // Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
  return axios
    .create({ baseURL: options.origin })
    .post(JIRA_SERVICE_DESK_API_PATH, jiraData(options, req), jiraOptions(options))
    .then(jiraRes => res.sendStatus(jiraRes.status))
    .catch(error => {
      if (error.response) {
        res.status(error.response.status).set('Content-Type', 'text/plain').send(error.response.data.errorMessage);
      } else {
        res.status(500).set('Content-Type', 'text/plain').send(error.message);
      }
    });
};
