<template>
  <b-link
    v-if="useRouterLink"
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
        type: [String, Object],
        default: ''
      },
      linkClass: {
        type: String,
        default: ''
      }
    },
    computed: {
      useRouterLink: function () {
        return (typeof this.destination !== 'string') || this.destination.startsWith('/');
      }
    }
  };
</script>
