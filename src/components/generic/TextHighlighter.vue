<template>
  <span>
    <template
      v-for="(val, index) in [].concat(texts)"
    >
      <strong
        v-if="val.highlight"
        :key="index"
        class="highlight"
        data-qa="highlighted"
      >{{ val.text }}</strong> <!-- Do not put onto a new line -->
      <span
        v-else
        :key="index"
      >{{ val.text }}</span> <!-- Do not put onto a new line -->
    </template>
  </span>
</template>

<script>
  export default {
    name: 'TextHighlighter',

    props: {
      texts: {
        type: [Array, Object],
        required: true
      }
    }
  };
</script>
