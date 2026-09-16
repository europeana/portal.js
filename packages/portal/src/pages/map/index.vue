<template>
  <ErrorMessage
    v-if="$store.state.error.error"
    data-qa="error message container"
    :error="$store.state.error.error"
  />
  <client-only v-else>
    <EntityOrganisationsMap
      :hash="true"
    />
  </client-only>
</template>

<script>
  import EntityOrganisationsMap from '@/components/entity/organisations/EntityOrganisationsMap';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'MapIndexPage',

    components: {
      EntityOrganisationsMap,
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    mixins: [
      pageMetaMixin
    ],

    computed: {
      pageMeta() {
        return {
          title: 'Map'
        };
      },
      heroImage() {
        return this.post.primaryImageOfPage || null;
      }
    },

    created() {
      if (!this.$features.organisationsMap) {
        this.$error(404, { scope: 'page' });
      }
    }
  };
</script>
