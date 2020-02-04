<template>
  <p>
    <b-link
      title="Share on Instagram"
    >
      <span class="icon-instagram" />
    </b-link>
    <b-link
      title="Share on Facebook"
      :href="facebookShareUrl"
    >
      <span class="icon-facebook" />
    </b-link>
    <b-link
      title="Share on Twitter"
      :href="twitterShareUrl"
    >
      <span class="icon-twitter" />
    </b-link>
    <b-link
      title="Share on Pinterest"
    >
      <span class="icon-pinterest" />
    </b-link>
  </p>
</template>

<script>
  export default {
    name: 'SocialShare',

    data() {
      return {
        location: null
      };
    },

    computed: {
      facebookShareUrl() {
        return `https://www.facebook.com/sharer/sharer.php?u=${this.location}${this.$route.fullPath}`;
      },
      twitterShareUrl() {
        return `https://twitter.com/intent/tweet?text=${this.location}${this.$route.fullPath}`;
      }
    },

    mounted() {
      this.location = window.location.href;
    }
  };
</script>
