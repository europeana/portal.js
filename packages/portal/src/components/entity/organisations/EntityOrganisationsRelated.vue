<template>
  <transition
    v-if="aggregatesFrom"
    appear
    name="fade"
  >
    <EntityBadges
      :entity-uris="aggregatesFrom"
      :title="$t('organisations.providingInstitutions.title')"
      class="mt-3 mt-lg-0"
      :transition="true"
      :limit="4"
    />
  </transition>
</template>

<script>
  import EntityBadges from '../EntityBadges.vue';

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
        aggregatesFrom: null
      };
    },

    async fetch() {
      const entityFullData = await this.$apis.entity.find([this.entityId]);

      this.aggregatesFrom = entityFullData[0]?.aggregatesFrom;
    }
  };
</script>
