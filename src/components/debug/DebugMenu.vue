<template>
  <figure data-qa="debug menu">
    <figcaption class="text-uppercase font-weight-bold">
      {{ $t('debug.debug') }}
    </figcaption>
    <ul
      class="m-0 p-0 footer-link-list"
    >
      <li>
        <ApiRequests
          v-if="showApiRequestsModal"
          :requests="axiosLoggerRequests"
        />
      </li>
    </ul>
  </figure>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    components: {
      ApiRequests: () => import('./ApiRequests')
    },

    computed: {
      ...mapState({
        axiosLoggerRequests: state => state.axiosLogger.requests
      }),

      showApiRequestsModal() {
        return this.$store.getters['debug/settings'].apiRequests;
      }
    }
  };
</script>
