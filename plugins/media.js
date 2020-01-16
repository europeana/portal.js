import { oEmbeddable } from './oembed.js';

export function isPDF(media) {
  return media.ebucoreHasMimeType === 'application/pdf';
}

export function isImage(media) {
  if (!media.ebucoreHasMimeType) {
    return false;
  }
  return media.ebucoreHasMimeType.startsWith('image/');
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
  return isIIIFMedia(media) && (
    ((media.dctermsIsReferencedBy || []).length === 0) ||
    media.dctermsIsReferencedBy.every((dctermsIsReferencedBy) =>
      dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, media.services)
    )
  );
}

function dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, services) {
  return services.some((service) => `${service.about}/info.json` === dctermsIsReferencedBy);
}

export function isIIIFPresentation(media) {
  return isIIIFMedia(media) && !isIIIFImage(media);
}

export function iiifManifest(media, europeanaIdentifier) {
  if (isIIIFPresentation(media)) {
    return media.dctermsIsReferencedBy.find((dctermsIsReferencedBy) =>
      !dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, media.services)
    );
  }

  return `https://iiif.europeana.eu/presentation${europeanaIdentifier}/manifest`;
}

export function isRichMedia(media, options = {}) {
  return isOEmbed(media) || isHTMLVideo(media) || isHTMLAudio(media) ||
    (options.iiif && isIIIFMedia(media));
}
