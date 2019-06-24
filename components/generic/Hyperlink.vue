<template>
  <b-link
    v-if="link.startsWith('/')"
    :to="link"
    :class="linkClass"
  >
    <slot />
  </b-link>
  <b-link
    v-else
    :href="link"
    :class="linkClass"
  >
    <slot />
  </b-link>
</template>

<script>
  export default {
    props: {
      link: {
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
