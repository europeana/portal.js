<template>
  <div
    data-qa="theme page"
    class="theme-page"
  />
</template>

<script>
  export default {
    name: 'ThemePage',

    asyncData({ params, query, error, app }) {
      const variables = {
        locale: app.i18n.isoLocale(),
        identifier: params.pathMatch,
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('themePage', variables)
        .then(response => response.data.data)
        .then(data => {
          const theme = data.themePage.items[0];

          return { theme };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    }

  };
</script>
