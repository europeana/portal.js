<template>
  <transition
    v-if="aggregatesFrom"
    appear
    name="fade"
  >
    <EntityBadges
      :entity-uris="aggregatesFrom"
      :related-collections="aggregatesFromEntities"
      :title="$t('organisations.providingInstitutions.title')"
      class="mt-3 mt-md-0"
      :transition="true"
      :limit="4"
      @entitiesFromUrisFetched="(entities) => relatedEntitiesFetched(entities)"
    />
  </transition>
</template>

<script>
  import EntityBadges from './EntityBadges.vue';

  export default {
    name: 'EntityOrganisationsRelated',

    components: {
      EntityBadges
    },

    props: {
      entityId: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        aggregatesFrom: null,
        aggregatesFromEntities: []
      };
    },

    async fetch() {
      const entityFullData = await this.$apis.entity.find([this.entityId]);
      const aggregatesFrom = entityFullData[0]?.aggregatesFrom;

      this.aggregatesFrom = aggregatesFrom;
    },

    methods: {
      relatedEntitiesFetched(organisations) {
        this.aggregatesFromEntities = organisations;
      }
    }
  };
</script>
