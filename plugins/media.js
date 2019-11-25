import { oEmbeddable } from './oembed.js';

export function isPDF(mimeType) {
  return mimeType === 'application/pdf';
}

export function isHTMLVideo(mimeType, codec) {
  return (mimeType === 'video/ogg') ||
    (mimeType === 'video/webm') ||
    ((mimeType === 'video/mp4') && (codec === 'h264'));
}

export function isHTMLAudio(mimeType) {
  return (mimeType === 'audio/flac') || (mimeType === 'audio/ogg') || (mimeType === 'audio/mp3');
}

export function isOEmbed(oembedUrl) {
  return oEmbeddable(oembedUrl);
}

// TODO: as the pdf is currently just an image with a link, it is not marked as "rich media", this might change in the future
export function isRichMedia(mimeType, codec, mediaUrl) {
  return isOEmbed(mediaUrl) || isHTMLVideo(mimeType, codec) || isHTMLAudio(mimeType);
}
