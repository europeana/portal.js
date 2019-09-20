<template>
  <b-link
    v-if="useRouterLink"
    :to="localePath({name: 'slug', params: { slug: destination.replace('/', '')}})"
    :class="isNavItem ? 'nav-link' : 'linkClass'"
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
      isNavItem: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      useRouterLink() {
        return (typeof this.destination !== 'string') || this.destination.startsWith('/');
      }
    }
  };
</script>
