import { oEmbeddable } from '../oembed/index.js';
import {
  PRESENTATION_URL as EUROPEANA_IIIF_PRESENTATION_BASE_URL,
  IIIF_IMAGE_URL
} from './iiif.js';

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
    } if (this.hasVideoMediaType) {
      return EDM_TYPE_VIDEO;
    } if (this.hasTextMediaType) {
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
    return this.isIIIFMedia && !this.isIIIFImage;
  }

  get iiifManifest() {
    if (this.isIIIFPresentation) {
      return this.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => !dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy, this.services)
      );
    }

    return `${EUROPEANA_IIIF_PRESENTATION_BASE_URL}${this.itemId}/manifest`;
  }

  get requiresDashJS() {
    return (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML) ||
      // FIXME: this is a hack to account for misinterpretation of %2B in URL query
      //        parameter on server-side only. Find a proper solution when the cause
      //        is known. See https://europeana.atlassian.net/browse/EC-5057
      (process.server && (this.mediaType === 'application/dash xml'));
  }
}

const serviceConformsToIIIFImageAPI = (service = {}) => {
  return (service.dctermsConformsTo || []).includes(IIIF_IMAGE_URL);
};

const dctermsIsReferencedByIsImageInfoRequest = (dctermsIsReferencedBy, services) => {
  return services.some((service) => `${service.about}/info.json` === dctermsIsReferencedBy);
};
