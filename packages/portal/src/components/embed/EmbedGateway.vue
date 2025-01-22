<template>
  <div
    class="h-100"
  >
    <slot
      v-if="opened"
      class="embed-gateway-opened"
    />
    <b-container
      v-else
      class="notification-overlay"
      :class="{'h-100': url, 'mw-100': embedCode}"
    >
      <b-row
        class="position-relative"
        :class="{ 'h-100': url}"
      >
        <b-col
          :lg="url ? '10' : null"
          class="thumbnail-background mx-auto h-100 position-absolute"
        >
          <MediaCardImage
            v-if="media"
            :media="media"
            :lazy="false"
            :linkable="false"
            thumbnail-size="large"
          />
          <div
            v-else
            class="icon-multimedia h-100 d-flex align-items-center justify-content-center"
          />
        </b-col>
        <b-col
          :lg="url ? '10' : null"
          class="notification-content mx-auto position-relative"
          :style="{
            'min-height': !!iframeDimensions.height && iframeDimensions.height,
            width: !!iframeDimensions.width && iframeDimensions.width,
          }"
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
  import klaroMixin from '@/mixins/klaro.js';
  import serviceForUrl from '@/utils/services/index.js';

  export default {
    name: 'EmbedGateway',

    components: {
      MediaCardImage: () => import('@/components/media/MediaCardImage.vue'),
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget')
    },

    mixins: [klaroMixin],

    props: {
      embedCode: {
        type: String,
        default: null
      },
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
        iframeDimensions: {},
        // TODO: set to false on feature toggle clean up
        opened: !this.$features.embeddedMediaNotification,
        renderCookieModal: false,
        provider: null,
        providerName: this.$t('klaro.services.unknownProvider'),
        providerUrl: null
      };
    },

    watch: {
      cookieConsentRequired(newVal) {
        if (!newVal) {
          this.checkConsentAndOpenEmbed();
        }
      },
      // klaroManager is not available in mounted so watch it to be ready instead
      klaroManager(newVal) {
        if (newVal) {
          this.checkConsentAndOpenEmbed();
        }
      }
    },

    created() {
      this.providerUrl = this.url;

      if (this.embedCode) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.embedCode, 'text/html');

        const iframe = doc.querySelector('iframe');
        const script = doc.querySelector('script');

        if (iframe) {
          this.iframeDimensions.height = isNaN(iframe.height) ? iframe.height : `${iframe.height}px`;
          this.iframeDimensions.width = isNaN(iframe.width) ? iframe.width : `${iframe.width}px`;
          this.providerUrl = iframe.src;
        } else if (script) {
          this.providerUrl = script.src;
        } else {
          // open the gate when there is no actual embed, but other code rendered such as audio, video or plain HTML
          this.opened = true;
        }
      }

      if (this.providerUrl) {
        this.provider = serviceForUrl(this.providerUrl);
      }

      if (this.provider && this.$te(`klaro.services.${this.provider.name}.title`)) {
        this.providerName = this.$t(`klaro.services.${this.provider.name}.title`);
      }
    },

    methods: {
      openCookieModal() {
        if (this.cookieConsentRequired) {
          this.$bvModal.show('cookie-modal');
        } else {
          this.renderCookieModal = true;
          this.$bvModal.show(this.cookieModalId);
        }
      },

      checkConsentAndOpenEmbed() {
        const consents = this.klaroManager?.loadConsents();
        const providerHasConsent = !!consents?.[this.provider?.name];

        if (providerHasConsent) {
          this.opened = true;
        }
      },

      consentAllEmbeddedContent() {
        if (this.cookieConsentRequired) {
          this.klaroManager.changeAll(true);
        } else {
          const allThirdPartyContentServices = this.klaroConfig?.services?.filter(s => s.purposes.includes('thirdPartyContent'));
          allThirdPartyContentServices?.forEach(service => this.klaroManager?.updateConsent(service.name, true));
        }

        this.openModalOrSaveConsents();
      },

      consentThisProvider() {
        this.klaroManager.updateConsent(this.provider.name, true);

        this.openModalOrSaveConsents();
      },

      openModalOrSaveConsents() {
        if (this.cookieConsentRequired) {
          this.$bvModal.show('cookie-modal');
        } else {
          this.klaroManager?.saveAndApplyConsents('save');
          this.checkConsentAndOpenEmbed();
        }
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
    overflow: auto;

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
          font-size: 8rem;
          color: $middlegrey;

          @media (min-width: $bp-medium) {
            font-size: 15rem;
          }
        }
      }
    }

    .icon-multimedia {
      background-color: $white;

      &:before {
        font-size: 8rem;
        color: $middlegrey;

        @media (min-width: $bp-medium) {
          font-size: 15rem;
        }
      }
    }
  }
</style>
