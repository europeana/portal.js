<template>
  <b-link
    v-if="link && src"
    :href="link"
    target="_blank"
  >
    <b-img-lazy
      :src="src"
      class="mw-100"
      alt=""
      data-qa="media preview image"
    />
  </b-link>
  <b-img-lazy
    v-else-if="!link && src"
    :src="src"
    alt=""
    class="mw-100"
  />
</template>

<script>
  export default {
    props: {
      link: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    }
  };
</script>
