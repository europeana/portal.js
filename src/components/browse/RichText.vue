<template>
  <b-row
    data-qa="markdown"
    :class="{ 'mb-5': richTextIsCard }"
    tag="section"
  >
    <b-col class="col-12 col-lg-9">
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
  import marked from 'marked';

  export default {
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
        return marked(this.text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep img {
    max-width: 100%;
  }
</style>
