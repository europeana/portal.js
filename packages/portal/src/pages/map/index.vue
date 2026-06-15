<template>
  <ErrorMessage
    v-if="$store.state.error.error"
    data-qa="error message container"
    :error="$store.state.error.error"
  />
  <client-only v-else>
    <EntityOrganisationsMap />
  </client-only>
</template>

<script>
  export default {
    name: 'MapIndexPage',

    components: {
      EntityOrganisationsMap: () => import('@/components/entity/organisations/EntityOrganisationsMap'),
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    created() {
      if (!this.$features.organisationsMap) {
        this.$error(404, { scope: 'page' });
      }
    }
  };
</script>
