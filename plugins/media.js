import { oEmbeddable } from './oembed';

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
  if (!media.ebucoreHasMimeType) return false;
  // use a temporary video element
  const vid = process.browser ? document.createElement('video') : null;
  return media.ebucoreHasMimeType.startsWith('video/') && vid && !!vid.canPlayType(media.ebucoreHasMimeType);
}

export function isHTMLAudio(media) {
  if (!media.ebucoreHasMimeType) return false;
  // Use a temporary audio element
  const aud = process.browser ? document.createElement('audio') : null;
  return media.ebucoreHasMimeType.startsWith('audio/') && aud && !!aud.canPlayType(media.ebucoreHasMimeType);
}

export function isPlayableMedia(media) {
  return (typeof media.ebucoreHasMimeType === 'string' && (
    isHTMLAudio(media) || isHTMLVideo(media) ||
    (media.ebucoreHasMimeType === 'application/dash+xml')
  )) ||
    new RegExp('^http://www.euscreen.eu/item.html').test(media.about);
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
    media.dctermsIsReferencedBy.every((dctermsIsReferencedBy) => dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, media.services)
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
    return media.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => !dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, media.services)
    );
  }

  return `https://iiif.europeana.eu/presentation${europeanaIdentifier}/manifest`;
}

export function isRichMedia(media) {
  return isOEmbed(media) ||
    isHTMLVideo(media) ||
    isHTMLAudio(media) ||
    isIIIFMedia(media) ||
    isPlayableMedia(media);
}

export function requiresDashJS(media) {
  return media === 'application/dash+xml';
}
