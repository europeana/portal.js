<template>
  <b-badge
    pill
    variant="primary"
    class="pl-3 py-2"
  >
    {{ truncatedText }}
    <nuxt-link
      :to="removeLinkTo"
      :aria-label="$t('delete')"
      class="pill-close p-1"
    >
      x
    </nuxt-link>
  </b-badge>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      removeLinkTo: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        limitCharacters: 20
      };
    },

    computed: {
      truncatedText() {
        return this.text.length > this.limitCharacters ? this.text.slice(0, this.limitCharacters) + '...' : this.text;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .badge-pill {
    .pill-close {
      color: $white;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
