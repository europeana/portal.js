<template>
  <b-row
    data-qa="markdown"
    class="mb-5"
    tag="section"
  >
    <b-col class="col-12 col-lg-9">
      <b-card>
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
  import marked from 'marked';

  export default {
    props: {
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
