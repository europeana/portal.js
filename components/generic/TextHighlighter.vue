<template>
  <span>
    <template
      v-for="(val, index) in [].concat(value)"
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
      value: {
        type: [Array, Object],
        required: true
      }
    }
  };
</script>
