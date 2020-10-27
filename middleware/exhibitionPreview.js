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
        const exhibition = chapter.linkedFrom.exhibitionPageCollection.items[0].identifier;

        console.log(exhibition, query.ctfExhibitionChapterId);
        redirect(app.$path({
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition, chapter: query.ctfExhibitionChapterId
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
