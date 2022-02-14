<template>
  <div
    class="experiment-container"
    role="group"
  >
    <AlertMessage
      error="This went wrong!"
    />
    <b-card
      v-for="(post, index) in posts"
      :key="index"
      :title="post.name"
      img-src="https://picsum.photos/600/300/?image=25"
      class="text-left"
      data-qa="content card"
    />
  </div>
</template>

<script>
  const PER_PAGE = 20;

  export default {
    name: 'ExperimentPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage')
    },

    layout: 'minimal',
    middleware: 'sanitisePageQuery',

    asyncData({ query, error, app, store }) {
      const variables = {
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview',
        limit: PER_PAGE,
        skip: (store.state.sanitised.page - 1) * PER_PAGE
      };

      return app.$contentful.query('blogFoyerPage', variables)
        .then(response => response.data.data)
        .then(data => {
          return {
            posts: data.blogPostingCollection.items,
            total: data.blogPostingCollection.total,
            page: store.state.sanitised.page,
            perPage: PER_PAGE
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    data() {
      return {
        perPage: PER_PAGE,
        page: null
      };
    },

    methods: {
      imageUrl(post) {
        return post.primaryImageOfPage?.image?.url || null;
      },
      imageContentType(post) {
        return post.primaryImageOfPage?.image?.contentType || null;
      },
      imageAlt(post) {
        return post.primaryImageOfPage?.image?.description || '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  body {
    padding: 2rem;
    margin: 0 auto;
    max-width: 60rem;
  }

  .experiment-container {
    display: flex;
    flex-wrap: wrap;
    --margin: 1rem;
    --modifier: calc(40rem - 100%);
    margin: 0 auto;
    // max-width: 1200px;

    .alert {
      background: red;
      width: 100%;
      margin: var(--margin);
    }

    .card {
      background-color: #000;
      color: #fff;
      min-width: calc(33% - (var(--margin) * 2));
      max-width: 100%;
      flex-grow: 1;
      flex-basis: calc(var(--modifier) * 999);
      margin: var(--margin);
    }
  }
</style>
