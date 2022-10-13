import axios from 'axios';

import errorHandler from '@europeana/express/src/error.js';

const JIRA_SERVICE_DESK_API_PATH = '/rest/servicedeskapi/request';
const JSON_CONTENT_TYPE = 'application/json';

const truncate = (text, length, ellipsis = '…') => {
  if (!text) {
    return null;
  }
  return text.length > length ? text.substring(0, length) + ellipsis : text;
};

const wordLength = text => text?.trim()?.match(/\w+/g)?.length || 0;

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

const validateFeedbackLength = feedback => wordLength(feedback) >= 5;

const validateFeedback = feedback => new Promise((resolve, reject) => {
  if (validateFeedbackLength(feedback)) {
    resolve();
  } else {
    reject({ status: 400, message: 'Invalid feedback.' });
  }
});

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

// Docs: https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post
export default (options = {}) => (req, res) => {
  return validateFeedback(req.body.feedback)
    .then(() => (axios
      .create({ baseURL: options.origin })
      .post(JIRA_SERVICE_DESK_API_PATH, jiraData(options, req), jiraOptions(options))
      .then(jiraRes => res.sendStatus(jiraRes.status))
    ))
    .catch(error => errorHandler(res, error));
};
