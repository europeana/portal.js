<template>
  <div
    class="landing-embed"
  >
    <div
      class="header"
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
      v-if="embed"
      class="embed-container"
    >
      <EmbedHTML
        :title="title"
        :html="embed.embed"
      />
    </b-container>
  </div>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';
  import EmbedHTML from '@/components/embed/EmbedHTML';

  export default {
    name: 'LandingEmbed',

    components: {
      EmbedHTML
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      title: {
        type: String,
        default: null
      },
      text: {
        type: String,
        default: null
      },
      embed: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-embed {
    margin-bottom: 3rem;

    @media (min-width: $bp-large) {
      margin-bottom: 6rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: 15rem;
    }
  }

  .header {
    color: $white;
    background-color: $blue;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding: 3.5rem 0;

    @media (min-width: $bp-medium) {
      padding: 4rem 0 17rem;
    }

    .container {
      position: relative; // Prevents blending with the background
    }

    .header-content {
      @media (min-width: $bp-xxl) {
        max-width: $max-text-column-width;
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
      min-height: 1440px;
    }
  }

</style>
