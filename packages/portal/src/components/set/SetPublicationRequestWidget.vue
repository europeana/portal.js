<template>
  <div>
    <b-button
      v-b-modal.set-publication-request-modal
      class="text-decoration-none text-nowrap ml-2 h-100"
    >
      {{ $t('actions.submitForPublication') }}
    </b-button>
    <b-modal
      id="set-publication-request-modal"
      :title="$t('set.publication.title')"
      title-tag="h2"
      hide-header-close
      hide-footer
    >
      <p>{{ $t('set.publication.description') }}</p>
      <h3>{{ $t('set.publication.process.title') }}</h3>
      <p>{{ $t('set.publication.process.description') }}</p>
      <h3>{{ $t('set.publication.time.title') }}</h3>
      <p>{{ $t('set.publication.time.description') }}</p>

      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="$bvModal.hide('set-publication-request-modal')"
        >
          {{ $t('actions.goBack') }}
        </b-button>
        <b-button
          variant="primary"
          @click="submitForPublication"
        >
          {{ $t('actions.submitForPublication') }}
        </b-button>
      </div>
    </b-modal>
    <!-- TODO: Refactor into reusable toast component with white background + buttons as also used for NewFeatureNotification -->
    <b-toast
      id="submit-publication-toast"
      auto-hide-delay="60000"
      is-status
      no-close-button
      solid
      toast-class="brand-toast-white"
      append-toast
      toaster="b-toaster-bottom-left-dynamic"
    >
      <i18n
        path="set.publication.toastMessage"
        tag="p"
      >
        <b-link
          class="text-decoration-none"
          :to="$path('/galleries')"
        >
          {{ 'Europeana.eu/galleries' }}
        </b-link>
      </i18n>
      <b-button
        variant="primary"
        class="d-block ml-auto mr-0"
        @click="$bvToast.hide('submit-publication-toast')"
      >
        {{ $t('set.publication.toastButton') }}
      </b-button>
    </b-toast>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'SetPublicationRequestWidget',

    props: {
      /**
       * Set
       */
      set: {
        type: Object,
        required: true
      }
    },

    methods: {
      async submitForPublication() {
        const postData = {
          submission: `Set ID: ${this.set.id}\
          Set creator: ${this.set.creator.nickname}`,
          email: this.$store.state.auth.user.email
        };

        await axios.post(
          '/_api/jira-service-desk/galleries',
          postData,
          { baseURL: this.$config.app.baseUrl }
        );

        this.$bvModal.hide('set-publication-request-modal');
        this.$bvToast.show('submit-publication-toast');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  ::v-deep #set-publication-request-modal {

    .modal-body {
      padding-top: 0.5rem;
    }

    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    p {
      color: $mediumgrey;
    }
  }
</style>
