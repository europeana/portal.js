<template>
  <b-row
    data-qa="markdown"
    class="mb-5"
    tag="section"
  >
    <b-col class="col-12 col-lg-9">
      <b-card>
        <h2 v-if="headline">
          {{ headline }}
        </h2>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-html="html"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  // import VueMarkdown from 'vue-markdown';
  import marked from 'marked';

  export default {
    props: {
      headline: {
        type: String,
        default: null
      },
      text: {
        type: String,
        required: true
      }
    },
    computed: {
      html() {
        return marked(this.text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ img {
    max-width: 100%;
  }
</style>
