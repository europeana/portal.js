<template>
  <transition
    v-if="aggregatesFrom"
    appear
    name="fade"
  >
    <!-- FIXME: wrapped in client-only as otherwise there are errors on hydration -->
    <client-only>
      <EntityBadges
        :entity-uris="aggregatesFrom"
        :title="$t('organisations.providingInstitutions.title')"
        class="mt-3 mt-lg-0"
        :transition="true"
        :limit="4"
        :total="aggregatesFrom?.length || 0"
      />
    </client-only>
  </transition>
</template>

<script>
  import { backendFetch } from '@/utils/backendFetch.js';
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
      const collections = await backendFetch('collections/retrieve', [[this.entityId], { fl: 'aggregatesFrom' }], this.$nuxt.context);

      this.aggregatesFrom = collections[0]?.aggregatesFrom;
    }
  };
</script>
