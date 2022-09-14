module.exports = async function (migration, { makeRequest }) {
  const response = await makeRequest({
    method: 'GET',
    url: '/entries',
    params: {
      'content_type': 'heroHeader',
      limit: 1000
    }
  });

  for (const entry of response.items) {
    const id = entry.sys.id;

    if (entry.sys.publishedAt) {
      console.log('Unpublishing', id);
      await makeRequest({
        method: 'DELETE',
        url: `/entries/${id}/published`
      });
    }

    console.log('Deleting', id);
    await makeRequest({
      method: 'DELETE',
      url: `/entries/${id}`
    });
  }

  migration.deleteContentType('heroHeader');
};
