<template>
  <b-link
    v-if="useRouterLink"
    :to="destination"
    :exact-active-class="exactActiveClass"
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
        type: [String, Object],
        default: ''
      },
      linkClass: {
        type: String,
        default: ''
      },
      exactActiveClass: {
        type: String,
        default: null
      }
    },
    computed: {
      useRouterLink() {
        return (typeof this.destination !== 'string') || this.destination.startsWith('/');
      }
    }
  };
</script>
