
export function urlIsContentfulAsset(url) {
  const hostnameMatch = url.match(/\/\/([^/]+)\//);
  return hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net');
}

export function optimisedSrcForContentfulAsset(asset, maxWidth, quality) {
  let imageUrl = asset.url;
  const imageQueryParams = [];

  // TODO: are optimisations possible on any other content types?
  if (asset.contentType === 'image/jpeg') {
    imageQueryParams.push('fm=jpg&fl=progressive');
    if (quality) {
      imageQueryParams.push(`q=${quality}`);
    }
  }

  if (maxWidth) {
    imageQueryParams.push(`w=${maxWidth}`);
  }

  if (imageQueryParams.length > 0) {
    imageUrl += '?' + imageQueryParams.join('&');
  }

  return imageUrl;
}
