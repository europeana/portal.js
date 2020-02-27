<template>
  <b-badge
    pill
    variant="primary"
    class="pl-3 py-2"
    data-qa="search bar pill"
    :title="text.values[0]"
    :lang="text.code"
  >
    {{ text.values[0] | truncate(20, $t('formatting.ellipsis')) }}
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
        type: Object,
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
