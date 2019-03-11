<template>
  <div class="mt-3">
    <b-badge
      v-for="option in selected"
      :key="option"
      variant="secondary"
      class="mr-2"
    >
      Type of media: {{ option }}
    </b-badge>
  </div>
</template>

<script>
  export default {
    props: {
      selected: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
