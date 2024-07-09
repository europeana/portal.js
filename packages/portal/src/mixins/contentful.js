export default {
  methods: {
    contentfulEntryHasContentType(entry, contentType) {
      return entry && (entry['__typename'] === contentType);
    }
  }
};
