<template>
  <div
    class="landing-embed"
    :class="{
      'background-applied': backgroundImage,
      'bg-bodygrey': !backgroundImage
    }"
  >
    <div
      class="header"
      :class="backgroundImageClasses"
    >
      <b-container>
        <b-col class="header-content col-lg-8 px-0 text-center mx-auto">
          <h2>
            {{ title }}
          </h2>
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="text"
            class="text mb-3"
            v-html="parseMarkdownHtml(text)"
          />
          <!-- eslint-enable vue/no-v-html -->
        </b-col>
      </b-container>
    </div>
    <b-container
      class="embed-container text-center"
    >
      <EmbedHTML
        v-if="embed"
        :title="title"
        :html="embed.embed"
      />
      <SmartLink
        v-if="link?.url"
        :destination="link.url"
        class="btn btn-cta btn-outline-primary"
        hide-external-icon
      >
        {{ link.text }}
      </SmartLink>
    </b-container>
  </div>
</template>

<script>
  import { parseMarkdownHtml } from '@/utils/markdown.js';
  import EmbedHTML from '@/components/embed/EmbedHTML';

  export default {
    name: 'LandingEmbed',

    components: {
      EmbedHTML,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    props: {
      /**
       * Title
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Text to display under title
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Link Object
       */
      link: {
        type: Object,
        default: () => {}
      },
      /**
       * Embed Object
       */
      embed: {
        type: Object,
        default: null
      },
      /**
       * Background image Object
       */
      backgroundImage: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        backgroundImageClasses: {
          'bg-color-highlight': this.backgroundImage?.profile?.background === 'highlight'
        }
      };
    },

    methods: {
      parseMarkdownHtml
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-embed {
    background-color: $bodygrey;
    padding-bottom: 3rem;

    @media (min-width: $bp-large) {
      padding-bottom: 6rem;
    }

    @media (min-width: $bp-4k) {
      padding-bottom: 15rem;
    }

    &.background-applied {
      background-color: $white;
      padding-bottom: 0;
      margin-bottom: 3rem;

      @media (min-width: $bp-large) {
        margin-bottom: 6rem;
      }

      @media (min-width: $bp-4k) {
        margin-bottom: 15rem;
      }
    }
  }

  .header {
    position: relative;
    padding: 3rem 0 1rem;

    @media (min-width: $bp-medium) {
      padding: 6rem 0 17rem;
    }

    @media (min-width: $bp-4k) {
      padding-top: 15rem;
    }

    &.bg-color-highlight {
      background-color: $blue;
      color: $white;
    }

    .container {
      position: relative; // Prevents blending with the background
    }

    .header-content {
      @media (min-width: $bp-xxl) {
        max-width: $max-text-column-width;
      }

      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k;
      }
    }
  }

  .embed-container {
    @media (min-width: $bp-medium) {
      margin-top: -13rem;
      position: relative;
    }

    ::v-deep iframe {
      max-width: 920px;
      width: 100%;

      @media (min-width: $bp-4k) {
        max-width: $max-text-column-width-landing-4k;
      }
    }

    .btn {
      margin-top: 2rem;

      @media (min-width: $bp-large) {
        margin-top: 4rem;
      }

      @media (min-width: $bp-4k) {
        margin-top: 8rem;
      }
    }
  }

</style>
