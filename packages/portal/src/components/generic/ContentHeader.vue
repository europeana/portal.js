<template>
  <header class="content-header row">
    <b-col
      cols="12"
      lg="9"
      class="col lead mt-3"
    >
      <div
        v-if="contextLabel"
        class="context-label"
        data-qa="context label"
      >
        {{ contextLabel }}
      </div>
      <h1
        data-qa="page title"
      >
        {{ title }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        class="description"
        v-html="description"
      />
      <!-- eslint-enable vue/no-v-html -->
      <template v-if="mediaUrl">
        <ShareButton
          :variant="buttonVariant"
          class="mt-3 mt-sm-4"
        />
        <SocialShareModal :media-url="mediaUrl" />
      </template>
    </b-col>
    <div class="divider" />
  </header>
</template>

<script>
  import ShareButton from '../../components/sharing/ShareButton';
  import SocialShareModal from '../../components/sharing/SocialShareModal';

  export default {
    name: 'ContentHeader',

    components: {
      ShareButton,
      SocialShareModal
    },

    props: {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        default: null
      },

      mediaUrl: {
        type: String,
        default: null
      },

      contextLabel: {
        type: String,
        default: null
      },

      buttonVariant: {
        type: String,
        default: 'outline-primary'
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.half-col {
  .col {
    margin-bottom: 2.25rem;

    @media (min-width: $bp-small) {
      margin-bottom: 3rem;
    }

    @media (min-width: $bp-xxxl) {
      margin-bottom: 3vw;
    }

    &.col-lg-9 {
      // TODO: update to use col-lg-6 when aligned site wide
      @media (min-width: $bp-large) {
        flex: 0 0 50%;
        max-width: 50%;
      }

    @media (min-width: $bp-xxxl) {
      max-width: $max-text-column-width;
    }
    }

    .description {
      color: $mediumgrey;

      @media (max-width: ($bp-small - 1px)) {
        font-size: $font-size-small;
      }
    }
  }

  .divider {
    border-bottom: 1px solid $bodygrey;
    margin-bottom: 1.75rem;
    flex-basis: 100%;
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;

    @media (min-width: $bp-xxxl) {
      border-bottom: 0.0625vw solid $bodygrey;
      margin-bottom: 1.75vw;
    }
  }
}
</style>
