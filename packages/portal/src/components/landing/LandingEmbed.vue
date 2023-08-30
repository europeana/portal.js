<template>
  <b-container>
    <div class="header mx-auto">
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
    </div>
    <EmbedHTML
      :html="embed.embed"
    />
  </b-container>
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
      backgroundImage: {
        type: Object,
        default: null
      },
      embed: {
        type: Object,
        default: null
      }
    }
  };
</script>
