<template>
  <div :class="$fetchState.error && 'white-page'">
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      :show-message="false"
    />
    <div
      v-else
      class="page white-page xxl-page"
    >
      <LandingHero
        :headline="page.headline"
        :text="page.text"
        :hero-image="page.primaryImageOfPage"
        variant="ds4ch"
      />
      <div style="height: 100vh;" />
    </div>
  </div>
</template>

<script>
  import LandingHero from '@/components/landing/LandingHero';

  export default {
    name: 'DS4CHPage',

    components: {
      LandingHero
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
