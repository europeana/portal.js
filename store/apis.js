export const apiUrlFromRequestHeaders = (api, headers) => {
  const headerKey = `x-europeana-${api}-api-url`;
  return headers[headerKey];
};

export const state = () => ({
  urls: {
    annotation: null,
    entity: null,
    newspaper: null,
    recommendation: null,
    record: null,
    set: null,
    thumbnail: null,
    ww1: null
  }
});

export const mutations = {
  readUrlsFromRequestHeaders(state, headers) {
    for (const api in state.urls) {
      state.urls[api] = apiUrlFromRequestHeaders(api, headers);
    }
  }
};
