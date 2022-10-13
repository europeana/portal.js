export default () => ({
  jira: {
    origin: process.env.JIRA_API_ORIGIN,
    username: process.env.JIRA_API_USERNAME,
    password: process.env.JIRA_API_PASSWORD,
    serviceDesk: {
      serviceDeskId: process.env.JIRA_API_SERVICE_DESK_ID,
      requestTypeId: process.env.JIRA_API_SERVICE_DESK_REQUEST_TYPE_ID,
      customFields: {
        pageUrl: process.env.JIRA_API_SERVICE_DESK_CUSTOM_FIELD_PAGE_URL,
        browser: process.env.JIRA_API_SERVICE_DESK_CUSTOM_FIELD_BROWSER,
        screensize: process.env.JIRA_API_SERVICE_DESK_CUSTOM_FIELD_SCREENSIZE
      }
    }
  },
  redis: {
    url: process.env.REDIS_URL,
    tlsCa: process.env.REDIS_TLS_CA
  }
});
