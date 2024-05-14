import md5 from 'md5';

/**
 * The logic for going from: http://commons.wikimedia.org/wiki/Special:FilePath/[image] to
 * https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/[image]/200px-[image]:
 * @image {String} image URL of wikimedia image
 * @size {Number} requested size of the image, default 255
 * @return {String} formatted thumbnail url
 */
export function getWikimediaThumbnailUrl(image, size = 255) {
  if (!(/\.wiki[mp]edia\.org\/wiki\/Special:FilePath\//.test(image))) {
    return image;
  }

  const filename = image.split('/').pop();
  const suffix = filename.endsWith('.svg') ? '.png' : '';
  const underscoredFilename = decodeURIComponent(filename).replace(/ /g, '_');
  const hash = md5(underscoredFilename);

  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${underscoredFilename}/${size}px-${underscoredFilename}${suffix}`;
}
