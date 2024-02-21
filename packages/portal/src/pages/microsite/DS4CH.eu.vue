<template>
  <div :class="$fetchState.error && 'white-page'">
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      :show-message="false"
    />
    <LandingPage
      v-else
      :headline="page.headline"
      :text="page.text"
      :cta="page.relatedLink"
      :sections="page.hasPartCollection?.items.filter((item) => !!item)"
      :primary-image-of-page="page.primaryImageOfPage"
    />
  </div>
</template>

<script>
  import ErrorMessage from '@/components/error/ErrorMessage';
  import LandingPage from '@/components/landing/LandingPage';

  export default {
    name: 'DS4CHPage',

    components: {
      ErrorMessage,
      LandingPage
    },

    layout: 'ds4ch',

    data() {
      return {
        page: {}
      };
    },

    async fetch() {
      const variables = {
        identifier: 'microsite/DS4CH.eu',
        locale: 'en-GB',
        preview: this.$route.query.mode === 'preview'
      };

      const response = await this.$contentful.query('browseLandingStaticPage', variables);
      const data = response.data.data;
      if ((data.landingPageCollection?.items?.length || 0) > 0) {
        this.page = data.landingPageCollection.items[0];
      } else {
        this.$error(404, { scope: 'page' });
      }
    }

    // TODO: add page meta
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .white-page {
    margin-top: -4.375rem;

    @media (min-width: ($bp-4k)) {
      margin-top: -6.5625rem;
    }

    &:after {
      content: none;
    }
  }
</style>
