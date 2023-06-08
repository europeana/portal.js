<template>
  <div>
    <h3 class="facet-label">
      <label
        :for="name"
      >
        Search in video subtitles
      </label>
    </h3>
    <div class="d-inline-flex mb-3">
      <b-form-input
        v-model="fulltextInput"
        :name="name"
        class="mr-sm-2 mb-sm-0"
      />
      <b-button
        :id="name"
        variant="primary"
        :aria-label="$t('actions.apply')"
        class="apply-button"
        @click.stop="$emit('applyFulltext', fulltextInput)"
      >
        <span class="apply-icon icon-arrow-down" />
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: 'fulltext'
      },

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
