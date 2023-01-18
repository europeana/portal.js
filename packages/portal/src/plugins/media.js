import { oEmbeddable } from './oembed/index.js';

const MEDIA_TYPE_APPLICATION = 'application';
const MEDIA_TYPE_APPLICATION_DASH_XML = `${MEDIA_TYPE_APPLICATION}/dash+xml`;
const MEDIA_TYPE_APPLICATION_PDF = `${MEDIA_TYPE_APPLICATION}/pdf`;
const MEDIA_TYPE_AUDIO = 'audio';
const MEDIA_TYPE_AUDIO_FLAC = `${MEDIA_TYPE_AUDIO}/flac`;
const MEDIA_TYPE_AUDIO_MPEG = `${MEDIA_TYPE_AUDIO}/mpeg`;
const MEDIA_TYPE_AUDIO_OGG = `${MEDIA_TYPE_AUDIO}/ogg`;
const MEDIA_TYPE_IMAGE = 'image';
const MEDIA_TYPE_TEXT = 'text';
const MEDIA_TYPE_VIDEO = 'video';
const MEDIA_TYPE_VIDEO_OGG = `${MEDIA_TYPE_VIDEO}/ogg`;
const MEDIA_TYPE_VIDEO_MP4 = `${MEDIA_TYPE_VIDEO}/mp4`;
const MEDIA_TYPE_VIDEO_WEBM = `${MEDIA_TYPE_VIDEO}/webm`;

const MEDIA_CODEC_H264 = 'h264';

export const webResourceEDMType = (webResource) => {
  let type = null;

  if (webResource.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_IMAGE}/`)) {
    type = 'IMAGE';
  } else if (webResource.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_AUDIO}/`)) {
    type = 'SOUND';
  } else if (webResource.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_VIDEO}/`) || (webResource.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_DASH_XML)) {
    type = 'VIDEO';
  } else if (webResource.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_TEXT}/`) || (webResource.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_PDF)) {
    type = 'TEXT';
  }
  // TODO: 3D media types?

  return type;
};

export function isHTMLVideo(webResource) {
  if (!webResource.ebucoreHasMimeType) {
    return false;
  }
  return [MEDIA_TYPE_VIDEO_OGG, MEDIA_TYPE_VIDEO_WEBM].includes(webResource.ebucoreHasMimeType) ||
    ((webResource.ebucoreHasMimeType === MEDIA_TYPE_VIDEO_MP4) && (webResource.edmCodecName === MEDIA_CODEC_H264));
}

export function isHTMLAudio(webResource) {
  return [MEDIA_TYPE_AUDIO_FLAC, MEDIA_TYPE_AUDIO_OGG, MEDIA_TYPE_AUDIO_MPEG].includes(webResource.ebucoreHasMimeType);
}

export function isPlayableMedia(webResource) {
  return (typeof webResource.ebucoreHasMimeType === 'string' && (
    isHTMLAudio(webResource) || isHTMLVideo(webResource) ||
    (webResource.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_DASH_XML)
  )) ||
    new RegExp('^http://www.euscreen.eu/item.html').test(webResource.about);
}

export function isOEmbed(webResource) {
  return oEmbeddable(webResource.about);
}

function serviceConformsToIIIFImageAPI(service = {}) {
  return (service.dctermsConformsTo || []).includes('http://iiif.io/api/image');
}

export function isIIIFMedia(webResource) {
  return isIIIFPresentation(webResource) ||
    (webResource.services || []).some((service) => serviceConformsToIIIFImageAPI(service));
}

export function isIIIFImage(webResource) {
  return isIIIFMedia(webResource) && (
    ((webResource.dctermsIsReferencedBy || []).length === 0) ||
    webResource.dctermsIsReferencedBy.every((dctermsIsReferencedBy) => dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, webResource.services)
    )
  );
}

function dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, services) {
  return services.some((service) => `${service.about}/info.json` === dctermsIsReferencedBy);
}

export function isIIIFPresentation(webResource) {
  return webResource.dctermsIsReferencedBy?.some((dctermsIsReferencedBy) => dctermsIsReferencedBy.endsWith('/manifest'));
}

export function iiifManifest(webResource, europeanaIdentifier) {
  if (isIIIFPresentation(webResource)) {
    return webResource.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => !dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, webResource.services)
    );
  }

  return `https://iiif.europeana.eu/presentation${europeanaIdentifier}/manifest`;
}

export function isRichMedia(webResource) {
  return isOEmbed(webResource) ||
    isHTMLVideo(webResource) ||
    isHTMLAudio(webResource) ||
    isIIIFMedia(webResource) ||
    isPlayableMedia(webResource);
}

export function requiresDashJS(webResource) {
  return (webResource === MEDIA_TYPE_APPLICATION_DASH_XML) ||
    // FIXME: this is a hack to account for misinterpretation of %2B in URL query
    //        parameter on server-side only. Find a proper solution when the cause
    //        is known. See https://europeana.atlassian.net/browse/EC-5057
    (process.server && (webResource === 'application/dash xml'));
}
