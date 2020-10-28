export default ({ query, error, app, redirect }) => {
  if (query.mode === 'preview' && query.ctfExhibitionChapterId) {
    const variables = {
      locale: app.i18n.isoLocale(),
      preview: query.mode === 'preview',
      identifier: query.ctfExhibitionChapterId
    };

    app.$contentful.query('exhibitionChapterSlug', variables)
      .then(response => response.data.data)
      .then(data => {
        const chapter = data.exhibitionChapterPageCollection.items[0];
        if (!chapter) return;

        const exhibition = chapter.linkedFrom.exhibitionPageCollection.items[0].identifier;

        redirect(app.$path({
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition, chapter: chapter.identifier
          },
          query: {
            mode: 'preview'
          }
        }));
      })
      .catch((e) => {
        error({ statusCode: 500, message: e.toString() });
      });
  }
};
