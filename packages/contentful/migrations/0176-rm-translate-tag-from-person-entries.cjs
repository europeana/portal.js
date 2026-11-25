// person entries may have fields like name "translated" (transliterated really),
// but that should not be automated across all languages.
// do this via makeRequest instead of migration.setTagsForEntries due to the latter
// leaving all entries in a changed state. see https://github.com/contentful/contentful-migration/issues/1230

const logUpdate = require('log-update');

module.exports = async function(migration, { makeRequest }) {
  const CONTENT_TYPE = 'person';
  const TAG_TO_REMOVE = 'translate';
  const LIMIT = 1000;
  const processedIds = new Set();
  let republishedCount = 0;
  let hasMore = true;
  let initialTotal = null;

  logUpdate(`Fetching '${CONTENT_TYPE}' entries with tag '${TAG_TO_REMOVE}'...`);

  while (hasMore) {
    const response = await makeRequest({
      method: 'GET',
      url: `/entries?content_type=${CONTENT_TYPE}&metadata.tags.sys.id[in]=${TAG_TO_REMOVE}&limit=${LIMIT}`,
    });

    if (initialTotal === null) {
      initialTotal = response.total;
    }

    const unprocessedItems = (response.items || []).filter(
      (entry) => !processedIds.has(entry.sys.id)
    );

    if (unprocessedItems.length === 0) {
      hasMore = false;
      continue;
    }

    for (const entry of unprocessedItems) {
      processedIds.add(entry.sys.id);

      const wasCleanlyPublished =
        Boolean(entry.sys.publishedVersion) &&
        !entry.sys.archivedVersion &&
        entry.sys.version === entry.sys.publishedVersion + 1;

      const updatedTags = (entry.metadata?.tags || []).filter(
        (tag) => tag.sys.id !== TAG_TO_REMOVE
      );

      const updatedEntry = await makeRequest({
        method: 'PUT',
        url: `/entries/${entry.sys.id}`,
        headers: {
          'X-Contentful-Version': entry.sys.version,
        },
        data: {
          fields: entry.fields,
          metadata: {
            ...entry.metadata,
            tags: updatedTags,
          },
        },
      });

      if (wasCleanlyPublished) {
        await makeRequest({
          method: 'PUT',
          url: `/entries/${entry.sys.id}/published`,
          headers: {
            'X-Contentful-Version': updatedEntry.sys.version,
          },
        });
        republishedCount += 1;
      }

      const percent = initialTotal > 0 ? Math.round((processedIds.size / initialTotal) * 100) : 100;
      logUpdate(
        `Removing tag '${TAG_TO_REMOVE}': ${processedIds.size}/${initialTotal} (${percent}%) | Republished: ${republishedCount} | Current: ${entry.sys.id}`
      );
    }
  }

  logUpdate(
    `Done! Removed tag '${TAG_TO_REMOVE}' from ${processedIds.size} '${CONTENT_TYPE}' entries (${republishedCount} republished).`
  );
  logUpdate.done();
};
