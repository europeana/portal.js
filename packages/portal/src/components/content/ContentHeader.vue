<template>
  <header class="content-header row">
    <b-col
      cols="12"
      lg="9"
      class="col lead"
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
        <ShareSocialModal :media-url="mediaUrl" />
      </template>
    </b-col>
    <div class="divider" />
  </header>
</template>

<script>
  import ShareButton from '../share/ShareButton';
  import ShareSocialModal from '../share/ShareSocialModal';

  export default {
    name: 'ContentHeader',

    components: {
      ShareButton,
      ShareSocialModal
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
@import '@europeana/style/scss/variables';

.half-col {
  .col {
    margin-bottom: 2.25rem;

    @media (min-width: $bp-small) {
      margin-bottom: 3rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: 4.5rem;
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
      color: $darkgrey;

      @media (max-width: ($bp-small - 1px)) {
        font-size: $font-size-base;
      }
    }
  }

  .divider {
    border-bottom: 1px solid $lightgrey;
    margin-bottom: 1.25rem;
    flex-basis: 100%;
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;

    @media (min-width: $bp-4k) {
      border-bottom: 2px solid $lightgrey;
      margin-bottom: calc(1.5 * 1.75rem);
    }
  }
}
</style>
