<template>
  <div>
    <b-link
      target="_blank"
      :title="$t('actions.shareOn', { social: 'Facebook' })"
      :href="facebookShareUrl"
      class="social-share"
      data-qa="share facebook button"
    >
      <span class="icon-facebook" />
    </b-link>
    <b-link
      target="_blank"
      :title="$t('actions.shareOn', { social: 'Twitter' })"
      :href="twitterShareUrl"
      class="social-share"
      data-qa="share twitter button"
    >
      <span class="icon-twitter" />
    </b-link>
    <b-link
      target="_blank"
      :title="$t('actions.shareOn', { social: 'Pinterest' })"
      :href="pinterestShareUrl"
      class="social-share"
      data-qa="share pinterest button"
    >
      <span class="icon-pinterest" />
    </b-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'SocialShare',

    props: {
      mediaUrl: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        location: null
      };
    },

    computed: {
      ...mapGetters({
        shareUrl: 'http/canonicalUrl'
      }),
      facebookShareUrl() {
        return `https://www.facebook.com/sharer/sharer.php?display=page&u=${this.shareUrl}`;
      },
      twitterShareUrl() {
        return `https://twitter.com/intent/tweet?text=${this.shareUrl}`;
      },
      pinterestShareUrl() {
        return `https://pinterest.com/pin/create/link/?url=${this.shareUrl}&media=${this.mediaUrl}`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

  a {
    align-items: center;
    background: transparent;
    border: 1px solid $black;
    border-radius: 50%;
    color: $black;
    display: inline-flex;
    height: calc(2.5rem - 1px);
    justify-content: center;
    text-decoration: none;
    transition: background 0.25s;
    width: calc(2.5rem - 1px);

    [class^="icon"] {
      color: $black;
      font-size: $font-size-medium;
    }

    &:hover {
      background: $black;

      [class^="icon"] {
        color: $white;
      }
    }
  }
</style>
