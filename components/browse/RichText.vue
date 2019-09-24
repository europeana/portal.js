<template>
  <b-row
    data-qa="markdown"
    class="mb-3"
  >
    <b-col>
      <h2 v-if="headline">
        {{ headline }}
      </h2>
      <!-- Keep Vue Markdown on the same line otherwise it will break -->
      <VueMarkdown>{{ text }}</VueMarkdown>
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
