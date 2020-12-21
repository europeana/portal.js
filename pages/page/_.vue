<template>
  <div>
    {{ identifier }}
    <h1>{{ name }}</h1>
    {{ description }}
  </div>
</template>

<script>
  export default {

    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('staticPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.staticPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          return data.staticPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    }

  };
</script>
