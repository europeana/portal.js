<template>
  <div>
    <b-link
      v-for="(network, index) in networks"
      :key="index"
      :title="$t('actions.shareOn', { social: network.name })"
      :href="network.url"
      :class="`social-share mr-1 ${network.identifier}`"
      :data-qa="`share ${network.identifier} button`"
      @click.native="$matomo && $matomo.trackEvent('Item_share', 'Click social share button', network.url);"
    >
      <span :class="`icon-${network.identifier}`" />
      <span
        v-if="withText"
        class="text"
      >{{ network.name }}
      </span>
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
      },
      withText: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapGetters({
        shareUrl: 'http/canonicalUrl'
      }),
      networks() {
        return [
          {
            identifier: 'facebook',
            name: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?display=page&u=${this.shareUrl}`
          },
          {
            identifier: 'twitter',
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?text=${this.shareUrl}`
          },
          {
            identifier: 'pinterest',
            name: 'Pinterest',
            url: `https://pinterest.com/pin/create/link/?url=${this.shareUrl}&media=${this.mediaUrl}`
          }
        ];
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

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

    [class^='icon'] {
      color: $black;
      font-size: $font-size-medium;
    }

    &:hover {
      background: $black;

      [class^='icon'] {
        color: $white;
      }
    }
  }
</style>
