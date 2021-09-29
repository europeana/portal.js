export default `
  query GalleryFoyerPage(
    $locale: String!,
    $preview: Boolean = false,
    $limit: Int = 20,
    $skip: Int = 0
  ) {
    imageGalleryCollection(preview: $preview, locale: $locale, order: datePublished_DESC, limit: $limit, skip: $skip) {
      total
      items {
        identifier
        name
        description
        hasPartCollection(limit: 1) {
          total
          items {
            identifier
            encoding
            thumbnailUrl
          }
        }
      }
    }
  }
`;
