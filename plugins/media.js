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
  return service.dctermsConformsTo.includes('http://iiif.io/api/image');
}

export function isIIIFMedia(media) {
  return (media.services || []).some((service) => serviceConformsToIIIFImageAPI(service));
}

export function isIIIFImage(media) {
  return isIIIFMedia(media) && ((media.dctermsIsReferencedBy || []).length === 0);
}

export function isIIIFPresentation(media) {
  return isIIIFMedia(media) && ((media.dctermsIsReferencedBy || []).length > 0);
}

export function isRichMedia(media, options = {}) {
  return isOEmbed(media) || isHTMLVideo(media) || isHTMLAudio(media) ||
    (options.iiif && isIIIFPresentation(media));
}
