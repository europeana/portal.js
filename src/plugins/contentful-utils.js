
export function urlIsContentfulAsset(url) {
  const hostnameMatch = url.match(/\/\/([^/]+)\//);
  return hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net');
}

export function optimisedSrcForContentfulAsset(asset, params = {}) {
  const imageUrl = new URL(asset.url);

  // TODO: are optimisations possible on any other content types?
  if (asset.contentType === 'image/jpeg') {
    params['fm'] = 'jpg';
    params['fl'] = 'progressive';
  }

  for (const key in params)  {
    imageUrl.searchParams.set(key, params[key]);
  }

  return imageUrl.toString();
}
