<template>
  <b-form-checkbox
    :id="`${facetName} - ${filter.label}`"
    :value="filter.label"
    :name="filter.label"
    class="mb-3"
    plain
  >
    {{ filter.label }}
    <span
      class="reset"
      :aria-label="$t('facets.button.reset')"
    >
      <span
        class="icon-close"
        aria-hidden="true"
        :title="`Reset ${filter.label}`"
      />
    </span>
  </b-form-checkbox>
</template>

<script>
  export default {
    props: {
      filter: {
        type: Object,
        required: true
      },
      facetName: {
        type: String,
        required: true
      }
    }
  };
</script>
