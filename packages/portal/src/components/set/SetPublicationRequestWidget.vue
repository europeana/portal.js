<template>
  <div>
    <b-button
      v-b-modal.request-publish-set-modal
      class="text-decoration-none text-nowrap ml-2 h-100"
    >
      {{ $t('actions.submitForPublication') }}
    </b-button>
    <b-modal
      id="request-publish-set-modal"
      :title="$t('set.publication.title')"
      hide-header-close
      hide-footer
    >
      <p>{{ $t('set.publication.description') }}</p>
      <h6>{{ $t('set.publication.process.title') }}</h6>
      <p>{{ $t('set.publication.process.description') }}</p>
      <h6>{{ $t('set.publication.time.title') }}</h6>
      <p>{{ $t('set.publication.time.description') }}</p>

      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="$bvModal.hide('request-publish-set-modal')"
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

        this.$bvModal.hide('request-publish-set-modal');
        this.$bvToast.show('submit-publication-toast');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  #request-publish-set-modal {

    h6 {
      font-weight: 600;
    }

    p {
      color: $mediumgrey;
      margin-top: 0.25rem;
    }
  }
</style>
