import { oEmbeddable } from './oembed.js';

export function isPDF(media) {
  return media.ebucoreHasMimeType === 'application/pdf';
}

export function isHTMLVideo(media) {
  return ['video/ogg', 'video/webm'].includes(media.ebucoreHasMimeType) ||
    ((media.ebucoreHasMimeType === 'video/mp4') && (media.edmCodecName === 'h264'));
}

export function isHTMLAudio(media) {
  return ['audio/flac', 'audio/ogg', 'audio/mpeg'].includes(media.ebucoreHasMimeType);
}

export function isOEmbed(media) {
  return oEmbeddable(media.about);
}

function serviceConformsToIIIFImageAPI(service = {}) {
  return (service.dctermsConformsTo || []).includes('http://iiif.io/api/image');
}

export function isIIIFMedia(media) {
  return (media.services || []).some((service) => serviceConformsToIIIFImageAPI(service));
}

export function isIIIFImage(media) {
  return isIIIFMedia(media) &&
    (((media.dctermsIsReferencedBy || []).length === 0) || iiifReferenceIsImageInfo(media));
}

function iiifReferenceIsImageInfo(media) {
  return `${media.services[0].about}/info.json` === media.dctermsIsReferencedBy[0];
}

export function isIIIFPresentation(media) {
  if (!isIIIFMedia(media) || ((media.dctermsIsReferencedBy || []).length === 0)) return false;

  return !iiifReferenceIsImageInfo(media);
}

export function iiifManifest(media, europeanaIdentifier) {
  if (isIIIFPresentation(media)) {
    return media.dctermsIsReferencedBy[0];
  }

  return `https://iiif.europeana.eu/presentation${europeanaIdentifier}/manifest`;
}

export function isRichMedia(media, options = {}) {
  return isOEmbed(media) || isHTMLVideo(media) || isHTMLAudio(media) ||
    (options.iiif && isIIIFMedia(media));
}
