<template>
  <div class="h-100">
    <slot
      v-if="opened"
      class="embed-gateway-opened"
    />
    <b-container
      v-else
      class="notification-overlay h-100"
    >
      <b-row class="h-100">
        <b-col
          lg="10"
          class="thumbnail-background mx-auto h-100 position-absolute"
        >
          <MediaCardImage
            :media="media"
            :lazy="false"
            :linkable="false"
            thumbnail-size="large"
          />
        </b-col>
        <b-col
          lg="10"
          class="notification-content mx-auto position-relative"
        >
          <p class="message">
            {{ $t('media.embedNotification.message', { provider: providerName }) }}
          </p>
          <b-button
            data-qa="load all button"
            variant="light"
            class="mb-2"
            @click="consentAllEmbeddedContent"
          >
            {{ $t('media.embedNotification.loadAllEmbeddedContent') }}
          </b-button>
          <i18n
            path="media.embedNotification.ofThirdPartyServices"
            tag="p"
          >
            <b-button
              data-qa="view full list button"
              variant="link"
              @click="openCookieModal"
            >
              {{ $t('media.embedNotification.viewFullList') }}
            </b-button>
          </i18n>
          <PageCookiesWidget
            v-if="renderCookieModal"
            :render-toast="false"
            :modal-id="cookieModalId"
            modal-title-path="klaro.main.purposes.thirdPartyContent.title"
            :modal-description-path="null"
            :hide-purposes="hidePurposes"
            :only-show-if-consent-required="false"
            @consentsApplied="checkConsentAndOpenEmbed"
          />
          <i18n
            path="media.embedNotification.ifNotAll"
            tag="p"
          >
            <b-button
              data-qa="load only this provider button"
              variant="link"
              @click="consentThisProvider"
            >
              {{ $t('media.embedNotification.loadOnlyThis') }}
            </b-button>
          </i18n>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import serviceForUrl from '@/utils/services/index.js';

  export default {
    name: 'EmbedGateway',

    components: {
      MediaCardImage: () => import('@/components/media/MediaCardImage.vue'),
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget')
    },

    props: {
      media: {
        type: Object,
        default: null
      },
      url: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        cookieModalId: 'embed-cookie-modal',
        hidePurposes: ['essential', 'usage'],
        // TODO: set to false on feature toggle clean up
        opened: !this.$features.embeddedMediaNotification,
        renderCookieModal: false,
        provider: null,
        providerName: this.$t('klaro.services.unknownProvider')
      };
    },

    watch: {
      '$serviceManager.selections.value': {
        deep: true,
        handler() {
          console.log('watch $serviceManager.selections', this.$serviceManager.selections.value)
          this.checkConsentAndOpenEmbed();
        }
      }
    },


    mounted() {
      this.provider = serviceForUrl(this.url);

      if (this.provider) {
        this.providerName = this.$t(`klaro.services.${this.provider.name}.title`);
      }

      this.checkConsentAndOpenEmbed();
    },

    methods: {
      openCookieModal() {
        if (this.$serviceManager.selectionsAreStored) {
          this.renderCookieModal = true;
          this.$bvModal.show(this.cookieModalId);
        } else {
          this.$bvModal.show('cookie-modal');
        }
      },

      checkConsentAndOpenEmbed() {
        console.log('checkConsentAndOpenEmbed', this.$serviceManager.serviceIsEnabled(this.provider?.name))
        this.opened = this.$serviceManager.serviceIsEnabled(this.provider?.name);
      },

      consentAllEmbeddedContent() {
        if (this.$serviceManager.selectionsAreStored) {
          this.$serviceManager.forEachService(
            (service) => this.$serviceManager.enableService(service.name),
            this.$serviceManager.getService('thirdPartyContent')
          );
        } else {
          this.$serviceManager.enableAllServices();
        }

        this.openModalOrSaveConsents();
      },

      consentThisProvider() {
        this.$serviceManager.enableService(this.provider.name);

        this.openModalOrSaveConsents();
      },

      openModalOrSaveConsents() {
        // if (!this.$serviceManager.selectionsAreStored) {
          this.$bvModal.show('cookie-modal');
        // } else {
          // this.$serviceManager.saveSelections();
        // }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .embed-gateway-opened {
    transition: $standard-transition;
  }

  .notification-overlay {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), var(--bg-img) center no-repeat;
    background-size: contain;
    color: $white;
    overflow: auto;
    position: relative;

    p {
      font-size: $font-size-extrasmall;
    }

    .message {
      font-weight: 600;
      font-size: $font-size-small;
    }

    .btn-light:not(:hover) {
      color: $mediumgrey;
    }

    .btn-link {
      color: $white;
      display: inline;
      font-size: $font-size-extrasmall;
      padding: 0;
      text-decoration-line: underline;
      vertical-align: baseline;
    }
  }

  .notification-content {
    padding: 1rem calc(15px + 1rem);

    @media (min-width: $bp-small) {
      padding: 2rem calc(15px + 2rem);
    }
  }

  .thumbnail-background {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &:after {
      content: '';
      background-color: rgba(0, 0, 0, 0.70);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    ::v-deep img {
      height: 100%;
      object-fit: cover;
    }

    ::v-deep .default-thumbnail {
      background-color: $white !important;
      height: 100%;
      width: 100%;
      border-radius: 0;

      [class^='icon-'],
      [class*=' icon-'] {
        opacity: 1;

        &:before {
          content: '\e96b';
          font-size: 15rem;
          color: $middlegrey;
        }
      }
    }
  }

</style>
