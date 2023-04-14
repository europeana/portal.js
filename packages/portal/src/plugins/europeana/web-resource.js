import { oEmbeddable } from '../oembed/index.js';
import { BASE_URL as EUROPEANA_IIIF_PRESENTATION_API_BASE_URL } from './iiif/presentation.js';
import { IIIF_IMAGE_URL } from './iiif/index.js';

const MEDIA_TYPE_APPLICATION = 'application';
const MEDIA_TYPE_APPLICATION_DASH_XML = `${MEDIA_TYPE_APPLICATION}/dash+xml`;
const MEDIA_TYPE_APPLICATION_PDF = `${MEDIA_TYPE_APPLICATION}/pdf`;
const MEDIA_TYPE_AUDIO = 'audio';
const MEDIA_TYPE_AUDIO_FLAC = `${MEDIA_TYPE_AUDIO}/x-flac`;
const MEDIA_TYPE_AUDIO_MPEG = `${MEDIA_TYPE_AUDIO}/mpeg`;
const MEDIA_TYPE_AUDIO_OGG = `${MEDIA_TYPE_AUDIO}/ogg`;
const MEDIA_TYPE_IMAGE = 'image';
const MEDIA_TYPE_TEXT = 'text';
const MEDIA_TYPE_VIDEO = 'video';
const MEDIA_TYPE_VIDEO_OGG = `${MEDIA_TYPE_VIDEO}/ogg`;
const MEDIA_TYPE_VIDEO_MP4 = `${MEDIA_TYPE_VIDEO}/mp4`;
const MEDIA_TYPE_VIDEO_WEBM = `${MEDIA_TYPE_VIDEO}/webm`;

const MEDIA_CODEC_H264 = 'h264';

const EDM_TYPE_IMAGE = 'IMAGE';
const EDM_TYPE_SOUND = 'SOUND';
const EDM_TYPE_VIDEO = 'VIDEO';
const EDM_TYPE_TEXT = 'TEXT';

const HTML_VIDEO_MEDIA_TYPES = [MEDIA_TYPE_VIDEO_OGG, MEDIA_TYPE_VIDEO_WEBM];
const HTML_AUDIO_MEDIA_TYPES = [MEDIA_TYPE_AUDIO_FLAC, MEDIA_TYPE_AUDIO_OGG, MEDIA_TYPE_AUDIO_MPEG];

export const WEB_RESOURCE_FIELDS = [
  'about',
  'dctermsIsReferencedBy',
  'ebucoreHasMimeType',
  'ebucoreHeight',
  'ebucoreWidth',
  'edmCodecName',
  'isNextInSequence',
  'svcsHasService',
  'webResourceEdmRights',
  'thumbnails',
  'services',
  'isShownAt'
];

export default class WebResource {
  constructor(edm, itemId) {
    for (const field of WEB_RESOURCE_FIELDS) {
      if (Object.keys(edm).includes(field)) {
        this[field] = edm[field];
      }
    }
    this.itemId = itemId;
  }

  get id() {
    return this.about;
  }

  get hasImageMediaType() {
    return this.mediaType?.startsWith(`${MEDIA_TYPE_IMAGE}/`);
  }

  get hasSoundMediaType() {
    return this.mediaType?.startsWith(`${MEDIA_TYPE_AUDIO}/`);
  }

  get hasVideoMediaType() {
    return this.mediaType?.startsWith(`${MEDIA_TYPE_VIDEO}/`) || (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML);
  }

  get hasTextMediaType() {
    return this.mediaType?.startsWith(`${MEDIA_TYPE_TEXT}/`) || (this.mediaType === MEDIA_TYPE_APPLICATION_PDF);
  }

  get mediaType() {
    return this.ebucoreHasMimeType;
  }

  get codecName() {
    return this.edmCodecName;
  }

  // TODO: 3D media types?
  get edmType() {
    if (this.hasImageMediaType) {
      return EDM_TYPE_IMAGE;
    } else if (this.hasSoundMediaType) {
      return EDM_TYPE_SOUND;
    } else if (this.hasVideoMediaType) {
      return EDM_TYPE_VIDEO;
    } else if (this.hasTextMediaType) {
      return EDM_TYPE_TEXT;
    } else {
      return undefined;
    }
  }

  get isHTMLVideo() {
    return this.mediaType && (
      HTML_VIDEO_MEDIA_TYPES.includes(this.mediaType) ||
      ((this.mediaType === MEDIA_TYPE_VIDEO_MP4) && (this.codecName === MEDIA_CODEC_H264))
    );
  }

  get isHTMLAudio() {
    return this.mediaType && HTML_AUDIO_MEDIA_TYPES.includes(this.mediaType);
  }

  get isOEmbed() {
    return oEmbeddable(this.id);
  }

  get isPlayableMedia() {
    return (
      this.isHTMLAudio || this.isHTMLVideo ||
      (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML)
    ) ||
      this.id?.startsWith('http://www.euscreen.eu/item.html') || false;
  }

  get isRichMedia() {
    return this.isOEmbed ||
      this.isHTMLVideo ||
      this.isHTMLAudio ||
      this.isIIIFMedia ||
      this.isPlayableMedia;
  }

  get isIIIFMedia() {
    return (this.services || []).some((service) => serviceConformsToIIIFImageAPI(service));
  }

  get isIIIFImage() {
    return this.isIIIFMedia && (
      ((this.dctermsIsReferencedBy || []).length === 0) ||
      this.dctermsIsReferencedBy.every((dctermsIsReferencedBy) => dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, this.services)
      )
    );
  }

  get isIIIFPresentation() {
    // TODO: checking for /manifest is too simplistic; refine to prevent false positives
    return this.dctermsIsReferencedBy?.some((dctermsIsReferencedBy) => dctermsIsReferencedBy.includes('/manifest'));
  }

  get iiifManifest() {
    if (this.isIIIFPresentation) {
      return this.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => !dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, this.services)
      );
    }

    return `${EUROPEANA_IIIF_PRESENTATION_API_BASE_URL}${this.itemId}/manifest`;
  }

  get requiresDashJS() {
    return (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML);
  }
}

const serviceConformsToIIIFImageAPI = (service = {}) => {
  return (service.dctermsConformsTo || []).includes(IIIF_IMAGE_URL);
};

const dctermsIsReferencedByIsImageInfoRequest = (dctermsIsReferencedBy, services) => {
  return services.some((service) => `${service.about}/info.json` === dctermsIsReferencedBy);
};
