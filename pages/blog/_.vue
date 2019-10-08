<template>
  <div>
    blog
  </div>
</template>

<script>
  import createClient from '../../plugins/contentful';

  export default {
    asyncData({ params, query, error, app }) {
      const contentfulClient = createClient(query.mode);

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'blogPosting',
        'sys.id': params.pathMatch
      })
        .then((response) => {
          if (response.total === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    }
  };
</script>
