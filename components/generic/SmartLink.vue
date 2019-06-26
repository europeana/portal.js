<template>
  <b-link
    v-if="destination.startsWith('/')"
    :to="destination"
    :class="linkClass"
  >
    <slot />
  </b-link>
  <b-link
    v-else
    :href="destination"
    :class="linkClass"
  >
    <slot />
  </b-link>
</template>

<script>
  export default {
    props: {
      destination: {
        type: String,
        default: ''
      },
      linkClass: {
        type: String,
        default: ''
      }
    }
  };
</script>
