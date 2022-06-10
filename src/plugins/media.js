import { oEmbeddable } from './oembed';

export const webResourceEDMType = (media) => {
  let type = null;

  if (media.ebucoreHasMimeType?.startsWith('image/')) {
    type = 'IMAGE';
  } else if (media.ebucoreHasMimeType?.startsWith('audio/')) {
    type = 'SOUND';
  } else if (media.ebucoreHasMimeType?.startsWith('video/') || (media.ebucoreHasMimeType === 'application/dash+xml')) {
    type = 'VIDEO';
  } else if (media.ebucoreHasMimeType?.startsWith('text/') || (media.ebucoreHasMimeType === 'application/pdf')) {
    type = 'TEXT';
  }
  // TODO: 3D media types?

  return type;
};

export function isHTMLVideo(media) {
  if (!media.ebucoreHasMimeType) {
    return false;
  }
  return ['video/ogg', 'video/webm'].includes(media.ebucoreHasMimeType) ||
    ((media.ebucoreHasMimeType === 'video/mp4') && (media.edmCodecName === 'h264'));
}

export function isHTMLAudio(media) {
  if (!media.ebucoreHasMimeType) {
    return false;
  }
  return ['audio/flac', 'audio/ogg', 'audio/mpeg'].includes(media.ebucoreHasMimeType);
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
  return (media === 'application/dash+xml') ||
    // FIXME: this is a hack to account for misinterpretation of %2B in URL query
    //        parameter on server-side only. Find a proper solution when the cause
    //        is known. See https://europeana.atlassian.net/browse/EC-5057
    (process.server && (media === 'application/dash xml'));
}
