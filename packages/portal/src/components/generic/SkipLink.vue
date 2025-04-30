<template>
  <b-button
    :class="classes"
    data-qa="skip to content link"
    @click="handleClick"
  >
    {{ text }}
  </b-button>
</template>

<script>
  export default {
    name: 'SkipLink',

    props: {
      selector: {
        type: String,
        default: '#main'
      },
      classes: {
        type: String,
        default: 'skip-main'
      },
      text: {
        type: String,
        default: this.$t('layout.skipToMain')
      }
    },

    methods: {
      handleClick() {
        const element = document.querySelector(this.selector);
        element.setAttribute('tabindex', '-1');
        element.focus();
      }
    }
  };
</script>
