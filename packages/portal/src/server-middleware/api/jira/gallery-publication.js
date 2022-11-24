import axios from 'axios';

import { truncate } from '../../../plugins/vue-filters';

const JIRA_SERVICE_DESK_API_PATH = '/rest/servicedeskapi/request';
const JSON_CONTENT_TYPE = 'application/json';

const jiraData = (options, req) => {
  const data = {
    serviceDeskId: options.galleryPublication.serviceDeskId,
    requestTypeId: options.galleryPublication.requestTypeId,
    requestFieldValues: {
      summary: truncate(req.body.submission, 50),
      description: req.body.submission
    }
  };

  if (req.body.email) {
    data.raiseOnBehalfOf = req.body.email;
  }
  return data;
};

const jiraOptions = options => ({
  auth: {
    // TODO: use separate account for gallery publication than feedback
    username: options.username,
    password: options.password
  },
  headers: {
    'Accept': JSON_CONTENT_TYPE,
    'Content-Type': JSON_CONTENT_TYPE
  }
});

// Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
export default (options = {}) => (req, res) => {
  return axios.create({ baseURL: options.origin })
    .post(JIRA_SERVICE_DESK_API_PATH, jiraData(options, req), jiraOptions(options))
    .then(jiraRes => res.sendStatus(jiraRes.status));
};
