import axios from 'axios';

import { errorHandler } from '..';

const JIRA_SERVICE_DESK_API_PATH = '/rest/api/3/issue/';
const JSON_CONTENT_TYPE = 'application/json';

const jiraPath = issueId => `${JIRA_SERVICE_DESK_API_PATH}${issueId}/transitions`;

const jiraOptions = options => ({
  auth: {
    username: options.serviceDesk.galleries.username,
    password: options.serviceDesk.galleries.password
  },
  headers: {
    'Accept': JSON_CONTENT_TYPE,
    'Content-Type': JSON_CONTENT_TYPE
  }
});

// Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-transition-post
export default (options = {}) => (req, res) => {
  return axios.create({ baseURL: options.origin })
    .post(jiraPath(req.body.issueId), req.body.transition, jiraOptions(options))
    .then(jiraRes => res.sendStatus(jiraRes.status))
    .catch(error => errorHandler(res, error));
};
