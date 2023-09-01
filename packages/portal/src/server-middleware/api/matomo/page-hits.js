import axios from 'axios';
import flatten from 'lodash/flatten.js';
import http from 'http';
import https from 'https';

import { errorHandler } from '../index.js';

let axiosInstance;

// TODO: error if config not present
const pageHitsFromMatomo = async(pageUrl, config = {}) => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: config.host,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      method: 'get',
      params: {
        date: 'last30',
        format: 'JSON',
        idSite: config.siteId,
        method: 'Actions.getPageUrl',
        module: 'API',
        period: 'day',
        'token_auth': config.authToken
      },
      url: '/'
    });
  }

  const matomoResponse = await axiosInstance.request({
    params: {
      pageUrl
    }
  });

  const dayStats = flatten(Object.values(matomoResponse.data || {}))
    .filter((stats) => stats.url === pageUrl);

  const dayHits = dayStats.map((stats) => stats['nb_hits'] || 0);

  return sum(dayHits);
};

const sum = (vals) => vals.reduce((memo, val) => memo + (val || 0), 0);

// TODO: limit to URLs at PORTAL_BASE_URL
// TODO: cache for 24 hours
export const pageHits = async(url, config = {}) => {
  url = new URL(url);

  const urlPathWithoutLocale = url.pathname.slice(3);
  const isLocalisedHomepage = (url.pathname.length === 3) && (urlPathWithoutLocale.length === 0);
  const isLocalisedOtherPage = urlPathWithoutLocale.startsWith('/');
  const isLocalisedUrl = (isLocalisedHomepage || isLocalisedOtherPage);

  let canonicalUrl = url;
  if (isLocalisedUrl) {
    canonicalUrl = new URL(url);
    canonicalUrl.pathname = urlPathWithoutLocale;
  }

  const localisedUrls = (config.langs || []).map((lang) => {
    const localisedUrl = new URL(canonicalUrl);
    localisedUrl.pathname = `/${lang}${localisedUrl.pathname}`;
    return localisedUrl;
  });

  const hitsPerLang = await Promise.all(
    localisedUrls.map((localisedUrl) => pageHitsFromMatomo(localisedUrl.toString(), config))
  );

  const hits = sum(hitsPerLang);

  return {
    canonicalUrl,
    hits,
    url
  };
};

// TODO: don't respond to bots; or only w/ cached data? (based on user-agent)
export default (config = {}) => (req, res) => {
  const url = req.query.url;

  return pageHits(url, config)
    .then(data => res.json(data))
    .catch(error => errorHandler(res, error));
};
