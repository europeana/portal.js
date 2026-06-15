<template>
  <ErrorMessage
    v-if="$store.state.error.error"
    data-qa="error message container"
    :error="$store.state.error.error"
  />
  <EntityOrganisationsMap v-else />
</template>

<script>
  import EntityOrganisationsMap from '@/components/entity/organisations/EntityOrganisationsMap';

  export default {
    name: 'MapIndexPage',

    components: {
      EntityOrganisationsMap,
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    created() {
      if (!this.$features.organisationsMap) {
        this.$error(404, { scope: 'page' });
      }
    }
  };
</script>
