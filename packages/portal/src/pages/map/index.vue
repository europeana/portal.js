<template>
  <EntityOrganisationsMap />
</template>

<script>
  export default {
    name: 'MapIndexPage',

    components: {
      EntityOrganisationsMap: () => import('@/components/entity/organisations/EntityOrganisationsMap')
    }
  };
</script>
