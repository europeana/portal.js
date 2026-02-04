<template>
  <b-modal
    id="content-warning-modal"
    :title="title"
    hide-header-close
    hide-footer
    data-qa="content warning modal"
    :static="modalStatic"
  >
    <p>{{ description }}</p>
    <div class="modal-footer pt-2">
      <b-button
        variant="outline-primary"
        data-qa="go away button"
        :to="localePath({ name: 'index' })"
        @click.native="$matomo && $matomo.trackEvent('Content warning', 'Click go away', pageSlug);"
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
      },
      pageSlug: {
        type: String,
        default: null
      },
      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    mounted() {
      this.showWarning();
    },

    methods: {
      showWarning() {
        const dismissedWarnings = JSON.parse(sessionStorage.dismissedWarnings || '[]');
        const contentWarningDismissed = dismissedWarnings?.includes(this.pageSlug);
        if (!contentWarningDismissed) {
          this.$bvModal.show('content-warning-modal');
          this.$matomo?.trackEvent('Content warning', 'Content warning modal shows', this.pageSlug);
        }
      },
      dismissWarning() {
        this.$bvModal.hide('content-warning-modal');
        const dismissedWarnings = JSON.parse(sessionStorage.dismissedWarnings || '[]');
        dismissedWarnings.push(this.pageSlug);
        sessionStorage.dismissedWarnings = JSON.stringify(dismissedWarnings);
        this.$matomo?.trackEvent('Content warning', 'Click continue', this.pageSlug);
      }
    }
  };
</script>
