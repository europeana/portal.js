<template>
  <b-badge
    pill
    variant="primary"
    class="pl-3 py-2"
    data-qa="search bar pill"
    :title="text"
  >
    {{ text | truncate(20, $t('formatting.ellipsis')) }}
    <nuxt-link
      :to="removeLinkTo"
      :aria-label="removeLinkLabel"
      class="pill-close p-1"
      data-qa="search bar pill button"
    >
      x
      <span class="sr-only">
        {{ removeLinkLabel }}
      </span>
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
      },
      removeLinkLabel: {
        type: [String, Object],
        default() {
          return this.$t('delete');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .badge-pill {
    background-color: $darkblue;
    .pill-close {
      color: $white;
      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
