<template>
  <b-row
    data-qa="markdown"
    :class="{ 'mb-5': richTextIsCard }"
    tag="section"
  >
    <b-col
      class="col-12"
      :class="richTextIsCard ? 'col-lg-6' : 'col-lg-9'"
    >
      <b-card
        v-if="html && richTextIsCard"
      >
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-html="html"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-card>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-else-if="html && !richTextIsCard"
        v-html="html"
      />
      <!-- eslint-enable vue/no-v-html -->
    </b-col>
  </b-row>
</template>

<script>
  import { marked } from 'marked';

  export default {
    name: 'ContentRichText',

    props: {
      text: {
        type: String,
        required: true
      },
      // TODO: find a better and cleaner solution
      // or remove in the future?
      richTextIsCard: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      html() {
        return marked.parse(this.text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep img {
    max-width: 100%;
  }

  .xxl-page {

    .col,
    .card {
      max-width: $max-text-column-width;
    }
  }
</style>
