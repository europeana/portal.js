import axios from 'axios';

import { errorHandler } from '../utils.js';
import truncate from '../../../utils/text/truncate.js';

const JIRA_SERVICE_DESK_API_PATH = '/rest/servicedeskapi/request';
const JSON_CONTENT_TYPE = 'application/json';

const jiraData = (options, req) => {
  const { customFields } = options.serviceDesk.galleries;

  let description = `h2. ${req.body.setTitle}`;
  if (req.body.setDescription) {
    description = `${description}\n\n${req.body.setDescription}`;
  }

  const data = {
    serviceDeskId: options.serviceDesk.galleries.serviceDeskId,
    requestTypeId: options.serviceDesk.galleries.requestTypeId,
    requestFieldValues: {
      summary: truncate(req.body.setTitle, 50),
      description,
      [customFields.setId]: req.body.setId,
      [customFields.setCreatorNickname]: req.body.setCreatorNickname,
      [customFields.pageUrl]: req.body.pageUrl
    }
  };

  if (req.body.email) {
    data.raiseOnBehalfOf = req.body.email;
  }

  return data;
};

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

// Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
export default (options = {}) => (req, res) => {
  return axios.create({ baseURL: options.origin })
    .post(JIRA_SERVICE_DESK_API_PATH, jiraData(options, req), jiraOptions(options))
    .then(jiraRes => res.sendStatus(jiraRes.status))
    .catch(error => errorHandler(res, error));
};
