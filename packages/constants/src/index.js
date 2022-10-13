// Some facets do not support enquoting of their field values.
export const UNQUOTABLE_FACETS = [
  'collection', // it _may_ be quoted, but our prewarmed filters are without
  'COLOURPALETTE',
  'IMAGE_COLOUR',
  'IMAGE_GREYSCALE', // WARNING: always returns zero results anyway
  'IMAGE_SIZE',
  'MEDIA',
  'MIME_TYPE',
  'REUSABILITY',
  'SOUND_DURATION',
  'SOUND_HQ',
  'TEXT_FULLTEXT',
  'THUMBNAIL',
  'VIDEO_HD'
];
