<template>
  <div>
    <b-form-group
      label="Search video subtitles"
    >
      <b-form-input
        v-model="fulltextInput"
        name="fulltext"
      />
    </b-form-group>
    <b-button
      variant="primary"
      :aria-label="$t('actions.apply')"
      class="apply-button"
      @click.stop="$emit('applyFulltext', fulltextInput)"
    >
      <span class="apply-icon icon-arrow-down" />
    </b-button>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        fulltextInput: this.value
      };
    },

    watch: {
      value(newVal) {
        this.fulltextInput = newVal;
      }
    }
  };
</script>
