import axios from 'axios';
import serviceForUrl from './index.js';

export function oEmbeddable(url) {
  return !!serviceForUrl(url)?.oembed;
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
    const provider = serviceForUrl(url);
    if (!provider?.oembed) {
      return null;
    }
    endpoint = provider.oembed;
  }

  return oEmbedForEndpoint(endpoint, url);
}
