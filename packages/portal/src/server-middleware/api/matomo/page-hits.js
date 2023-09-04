import axios from 'axios';
import flatten from 'lodash/flatten.js';
import http from 'http';
import https from 'https';
import { createClient } from 'redis';

import { errorHandler } from '../index.js';

const CACHE_KEY_PREFIX = '@europeana:matomo:page-hits';

let matomoAxiosInstance;
let redisClient;

const pageHitsFromMatomo = async(pageUrl) => {
  const matomoResponse = await matomoAxiosInstance.request({
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

const cacheKey = (url) => {
  return `${CACHE_KEY_PREFIX}:${url}`;
};

// TODO: limit to URLs at PORTAL_BASE_URL
const pageHits = async(url, langs) => {
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

  let hits = await redisClient.get(cacheKey(canonicalUrl));

  if (hits === null) {
    const localisedUrls = (langs || []).map((lang) => {
      const localisedUrl = new URL(canonicalUrl);
      localisedUrl.pathname = `/${lang}${localisedUrl.pathname}`;
      return localisedUrl;
    });

    const hitsPerLang = await Promise.all(
      localisedUrls.map((localisedUrl) => pageHitsFromMatomo(localisedUrl.toString()))
    );

    hits = sum(hitsPerLang);
    await redisClient.set(cacheKey(canonicalUrl), hits.toString(), {
      EX: 60 * 60 * 24 // expire after 24 hours
    });
  } else {
    hits = Number(hits);
  }

  return {
    canonicalUrl,
    hits,
    url
  };
};

// TODO: error if configs not present
// TODO: don't respond to bots; or only w/ cached data? (based on user-agent)
export default (config = {}) => {
  if (!redisClient) {
    redisClient = createClient(config.redis);
    redisClient.on('error', console.error);
  }
  if (!matomoAxiosInstance) {
    matomoAxiosInstance = axios.create({
      baseURL: config.matomo.host,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      method: 'get',
      params: {
        date: 'last30',
        format: 'JSON',
        idSite: config.matomo.siteId,
        method: 'Actions.getPageUrl',
        module: 'API',
        period: 'day',
        'token_auth': config.matomo.authToken
      },
      url: '/'
    });
  }

  return async(req, res) => {
    const url = req.query.url;

    try {
      redisClient.connect();
      const data = await pageHits(url, config.matomo.langs);
      res.json(data);
    } catch (error) {
      errorHandler(res, error);
    } finally {
      if (redisClient.isOpen) {
        redisClient.disconnect();
      }
    }
  };
};
