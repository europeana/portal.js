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

export const webResourceEDMType = (media) => {
  let type = null;

  if (media.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_IMAGE}/`)) {
    type = 'IMAGE';
  } else if (media.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_AUDIO}/`)) {
    type = 'SOUND';
  } else if (media.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_VIDEO}/`) || (media.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_DASH_XML)) {
    type = 'VIDEO';
  } else if (media.ebucoreHasMimeType?.startsWith(`${MEDIA_TYPE_TEXT}/`) || (media.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_PDF)) {
    type = 'TEXT';
  }
  // TODO: 3D media types?

  return type;
};

export function isHTMLVideo(media) {
  if (!media.ebucoreHasMimeType) {
    return false;
  }
  return [MEDIA_TYPE_VIDEO_OGG, MEDIA_TYPE_VIDEO_WEBM].includes(media.ebucoreHasMimeType) ||
    ((media.ebucoreHasMimeType === MEDIA_TYPE_VIDEO_MP4) && (media.edmCodecName === MEDIA_CODEC_H264));
}

export function isHTMLAudio(media) {
  return [MEDIA_TYPE_AUDIO_FLAC, MEDIA_TYPE_AUDIO_OGG, MEDIA_TYPE_AUDIO_MPEG].includes(media.ebucoreHasMimeType);
}

export function isPlayableMedia(media) {
  return (typeof media.ebucoreHasMimeType === 'string' && (
    isHTMLAudio(media) || isHTMLVideo(media) ||
    (media.ebucoreHasMimeType === MEDIA_TYPE_APPLICATION_DASH_XML)
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
  return (media === MEDIA_TYPE_APPLICATION_DASH_XML) ||
    // FIXME: this is a hack to account for misinterpretation of %2B in URL query
    //        parameter on server-side only. Find a proper solution when the cause
    //        is known. See https://europeana.atlassian.net/browse/EC-5057
    (process.server && (media === 'application/dash xml'));
}
