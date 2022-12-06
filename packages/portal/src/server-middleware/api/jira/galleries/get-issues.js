
import axios from 'axios';
import { errorHandler } from '../..';

const JIRA_SEARCH_API_PATH = '/rest/api/3/search';
const JSON_CONTENT_TYPE = 'application/json';

const jiraOptions = (options, req) => ({
  auth: {
    username: options.serviceDesk.galleries.username,
    password: options.serviceDesk.galleries.password
  },
  headers: {
    'Accept': JSON_CONTENT_TYPE
  },
  params: req.query
});

// Docs: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get
export default (options = {}) => (req, res) => {
  return axios.create({ baseURL: options.origin })
    .get(JIRA_SEARCH_API_PATH, jiraOptions(options, req))
    .then(jiraRes => res.send(jiraRes.data))
    .catch(error => errorHandler(res, error));
};
