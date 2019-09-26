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
        <!-- Keep Vue Markdown on the same line otherwise it will break -->
        <VueMarkdown>{{ text }}</VueMarkdown>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  import VueMarkdown from 'vue-markdown';

  export default {
    components: {
      VueMarkdown
    },
    props: {
      headline: {
        type: String,
        default: null
      },
      text: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ img {
    max-width: 100%;
  }
</style>
