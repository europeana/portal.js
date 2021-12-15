<template>
  <b-modal
    id="content-warning-modal"
    :title="title"
    hide-header-close
    hide-footer
    data-qa="share modal"
  >
    <p>{{ description }}</p>
    <div class="modal-footer pt-2">
      <b-button
        variant="outline-primary"
        :to="$path({ name: 'index' })"
      >
        {{ $t('actions.goHome') }}
      </b-button>
      <b-button
        variant="primary"
        class="continue-button"
        @click="dismissWarning"
      >
        {{ $t('actions.continue') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'ContentWarningModal',

    props: {
      title: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      }
    },

    computed: {
      contentId() {
        return this.$route.params?.exhibition ? `exhibition-${this.$route.params?.exhibition}` : `blog-${this.$route.params?.[0]}`;
      }
    },

    mounted() {
      this.showWarning();
    },

    methods: {
      showWarning() {
        const dismissedWarnings = sessionStorage.dismissedWarnings?.split(',');
        const contentWarningDismissed = dismissedWarnings?.includes(this.contentId);
        !contentWarningDismissed && this.$bvModal.show('content-warning-modal');
      },
      dismissWarning() {
        this.$bvModal.hide('content-warning-modal');
        if (!sessionStorage.dismissedWarnings) {
          sessionStorage.dismissedWarnings = '';
        }
        sessionStorage.dismissedWarnings = sessionStorage.dismissedWarnings.concat(`${this.contentId},`);
      }
    }
  };
</script>
