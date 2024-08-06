import axios from 'axios';
import escapeRegExp from 'lodash/escapeRegExp.js';
import providers from './providers.js';

for (const provider of providers) {
  provider.schemeRegExps = provider.schemes.map((scheme) => {
    const escaped = escapeRegExp(scheme).replace(/\\\*/g, '.+');
    return new RegExp(escaped);
  });
}

function providerSupportsUrl(provider, url) {
  for (const schemeRegExp of provider.schemeRegExps) {
    if (schemeRegExp.test(url)) {
      return true;
    }
  }
  return false;
}

function providerForUrl(url) {
  for (const provider of providers) {
    if (providerSupportsUrl(provider, url)) {
      return provider;
    }
  }
  return null;
}

export function oEmbeddable(url) {
  return providerForUrl(url) !== null;
}

export async function oEmbedForEndpoint(endpoint, url) {
  let response = null;
  try {
    response = await axios.get(endpoint, {
      params: { url, format: 'json' }
    });
  } catch (e) {
    // handle network etc errors quietly, letting the caller infer a problem
    // based on null return value
  }
  return response;
}

export default function oEmbed(url, endpoint) {
  if (!endpoint) {
    const provider = providerForUrl(url);
    if (!provider) {
      return null;
    }
    endpoint = provider.endpoint;
  }

  return oEmbedForEndpoint(endpoint, url);
}
