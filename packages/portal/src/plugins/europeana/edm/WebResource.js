import { oEmbeddable } from '@/utils/services/oembed.js';
import { IIIF_PRESENTATION_API_URL } from '../iiif/index.js';
import Base from './Base.js';

const MEDIA_TYPE_APPLICATION = 'application';
const MEDIA_TYPE_APPLICATION_DASH_XML = `${MEDIA_TYPE_APPLICATION}/dash+xml`;
const MEDIA_TYPE_APPLICATION_PDF = `${MEDIA_TYPE_APPLICATION}/pdf`;
const MEDIA_TYPE_AUDIO = 'audio';
const MEDIA_TYPE_AUDIO_FLAC = `${MEDIA_TYPE_AUDIO}/x-flac`;
const MEDIA_TYPE_AUDIO_MPEG = `${MEDIA_TYPE_AUDIO}/mpeg`;
const MEDIA_TYPE_AUDIO_OGG = `${MEDIA_TYPE_AUDIO}/ogg`;
const MEDIA_TYPE_IMAGE = 'image';
const MEDIA_TYPE_IMAGE_BMP = `${MEDIA_TYPE_IMAGE}/bmp`;
const MEDIA_TYPE_IMAGE_GIF = `${MEDIA_TYPE_IMAGE}/gif`;
const MEDIA_TYPE_IMAGE_JPEG = `${MEDIA_TYPE_IMAGE}/jpeg`;
const MEDIA_TYPE_IMAGE_PNG = `${MEDIA_TYPE_IMAGE}/png`;
const MEDIA_TYPE_IMAGE_SVG_XML = `${MEDIA_TYPE_IMAGE}/svg+xml`;
const MEDIA_TYPE_IMAGE_WEBP = `${MEDIA_TYPE_IMAGE}/webp`;
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

const HTML_AUDIO_MEDIA_TYPES = [MEDIA_TYPE_AUDIO_FLAC, MEDIA_TYPE_AUDIO_OGG, MEDIA_TYPE_AUDIO_MPEG];
const HTML_IMAGE_MEDIA_TYPES = [
  MEDIA_TYPE_IMAGE_BMP,
  MEDIA_TYPE_IMAGE_GIF,
  MEDIA_TYPE_IMAGE_JPEG,
  MEDIA_TYPE_IMAGE_PNG,
  MEDIA_TYPE_IMAGE_SVG_XML,
  MEDIA_TYPE_IMAGE_WEBP
];
const HTML_VIDEO_MEDIA_TYPES = [MEDIA_TYPE_VIDEO_OGG, MEDIA_TYPE_VIDEO_WEBM];

export default class WebResource extends Base {
  static fields = [
    'about',
    'dctermsIsReferencedBy',
    'ebucoreHasMimeType',
    'ebucoreHeight',
    'ebucoreWidth',
    'edmCodecName',
    'forEdmIsShownAt',
    'isNextInSequence',
    'preview',
    'rdfType',
    'svcsHasService',
    'webResourceEdmRights'
  ];

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
    return this.mediaType?.startsWith(`${MEDIA_TYPE_TEXT}/`) || this.isPDF;
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

  get imageMegaPixels() {
    if (!this.hasImageMediaType) {
      return undefined;
    }
    if (!this.ebucoreWidth || !this.ebucoreHeight) {
      return undefined;
    }
    return (this.ebucoreWidth * this.ebucoreHeight) / 1000000;
  }

  get imageSize() {
    const mp = this.imageMegaPixels;

    if (mp > 4) {
      return 'extra_large';
    } else if (mp > 1) {
      return 'large';
    } else if (mp > 0.5) {
      return 'medium';
    } else if (mp > 0) {
      return 'small';
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

  get isHTMLImage() {
    return this.mediaType && HTML_IMAGE_MEDIA_TYPES.includes(this.mediaType);
  }

  get isOEmbed() {
    return oEmbeddable(this.id);
  }

  get isPDF() {
    return this.mediaType === MEDIA_TYPE_APPLICATION_PDF;
  }

  get isPlayableMedia() {
    return (
      this.isHTMLAudio || this.isHTMLVideo ||
      (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML)
    ) ||
      this.isEUScreenMedia || false;
  }

  get isEUScreenMedia() {
    return this.id?.startsWith('http://www.euscreen.eu/item.html') ||
      this.id?.startsWith('https://www.euscreen.eu/item.html') || false;
  }

  get isRichMedia() {
    return this.isOEmbed ||
      this.isHTMLVideo ||
      this.isHTMLAudio ||
      this.isPlayableMedia;
  }

  get isIIIFPresentationManifest() {
    return this.rdfType?.startsWith(IIIF_PRESENTATION_API_URL);
  }

  isDisplayableByIIIFPresentationManifest(iiifPresentationManifest) {
    return this.dctermsIsReferencedBy?.includes(iiifPresentationManifest) &&
      HTML_IMAGE_MEDIA_TYPES.includes(this.ebucoreHasMimeType);
  }

  get requiresDashJS() {
    return (this.mediaType === MEDIA_TYPE_APPLICATION_DASH_XML);
  }
}
