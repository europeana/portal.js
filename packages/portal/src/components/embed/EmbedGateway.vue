<template>
  <div class="h-100">
    <slot
      v-if="opened"
      class="embed-gateway-opened"
    />
    <b-container
      v-else
      class="notification-overlay h-100"
      :style="thumbnail && {'--bg-img': `url(${thumbnail})`}"
    >
      <b-row>
        <b-col
          lg="10"
          class="mx-auto"
        >
          <!-- TODO: find and add actual provider name -->
          <p class="message">
            {{ $t('media.embedNotification.message', { provider: 'PROVIDER NAME' }) }}
          </p>
          <!-- TODO: update Klaro when clicked -->
          <b-button
            :pressed.sync="opened"
            variant="light"
            class="mb-2"
          >
            {{ $t('media.embedNotification.loadAllEmbeddedContent') }}
          </b-button>
          <i18n
            path="media.embedNotification.ofThirdPartyServices"
            tag="p"
          >
            <!-- TODO: open modal when clicked -->
            <b-button
              variant="link"
            >
              {{ $t('media.embedNotification.viewFullList') }}
            </b-button>
          </i18n>
          <i18n
            path="media.embedNotification.ifNotAll"
            tag="p"
          >
            <!-- TODO: open modal when clicked -->
            <b-button
              variant="link"
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
  export default {
    name: 'EmbedGateway',

    props: {
      thumbnail: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        opened: false
      };
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
    padding: 1rem;
    overflow: auto;

    @media (min-width: $bp-small) {
      padding: 2rem;
    }

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

</style>
