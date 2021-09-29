export default `
  query GalleryPage(
    $identifier: String!,
    $locale: String!,
    $preview: Boolean = false
  ) {
    imageGalleryCollection(preview: $preview, locale: $locale, where: { identifier: $identifier }, limit: 1) {
      total
      items {
        identifier
        name
        description
        hasPartCollection(limit: 100) {
          total
          items {
            identifier
            encoding
            thumbnailUrl
            name
          }
        }
      }
    }
  }
`;
