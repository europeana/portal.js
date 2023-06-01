<template>
  <div>
    <b-button
      v-b-modal.set-publication-request-modal
      class="text-decoration-none text-nowrap h-100"
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
          @click="$bvModal.hide('set-publication-request-modal'), submitFailed = false"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          @click="submitForPublication"
        >
          {{ $t('actions.submitForPublication') }}
        </b-button>
        <p
          v-if="submitFailed"
          data-qa="failed submission message"
          class="request-failed mb-0 d-flex align-items-center justify-content-end"
        >
          <span class="icon-cancel-circle mr-2" />
          {{ $t('set.publication.failedSubmission') }}
        </p>
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
        <template #galleries>
          <b-link
            class="text-decoration-none"
            :to="localePath('/galleries')"
          >
            {{ 'Europeana.eu/galleries' }}
          </b-link>
        </template>
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
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
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

    data() {
      return {
        submitFailed: false
      };
    },

    methods: {
      async submitForPublication() {
        const postData = {
          pageUrl: window.location.href,
          setTitle: langMapValueForLocale(this.set.title, this.$i18n.locale).values[0],
          setDescription: langMapValueForLocale(this.set.description, this.$i18n.locale).values[0],
          setId: this.set.id,
          setCreatorNickname: this.set.creator.nickname,
          email: this.$store.state.auth.profile.email
        };
        try {
          await axios.post(
            '/_api/jira-service-desk/galleries',
            postData,
            { baseURL: this.$config.app.baseUrl }
          );
          this.$bvModal.hide('set-publication-request-modal');
          this.$bvToast.show('submit-publication-toast');
        } catch (e) {
          this.submitFailed = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep #set-publication-request-modal {

    .modal-body {
      padding-top: 0.5rem;
    }

    h3 {
      font-size: $font-size-base;
      font-weight: 600;
      margin-bottom: 0.25rem;

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
        margin-bottom: calc(1.5 * 0.25rem);
      }
    }

    p {
      color: $mediumgrey;

      &.request-failed {
        font-size: $font-size-small;
        flex: 0 0 100%;

        @media (min-width: $bp-4k) {
          font-size: $font-size-small-4k;
        }
      }
    }

    .icon-cancel-circle::before {
      color: $red;
    }
  }
</style>
