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
      shareTo: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      ...mapGetters({
        shareUrl: 'http/canonicalUrlWithoutLocale'
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
            url: `https://pinterest.com/pin/create/link/?url=${this.shareUrl}` + (this.mediaUrl ? `&media=${this.mediaUrl}` : '')
          }
        ].concat(this.shareTo);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  a {
    align-items: center;
    display: inline-flex;
    text-decoration: none;
    border-radius: 0.25rem;
    width: calc(100% / 3 - 10px);
    margin-right: 0 !important;
    justify-content: flex-start;
    padding: 0.75rem 0.625rem;

    @media (max-width: $bp-small) {
      width: 100%;
      margin-bottom: 10px;
    }

    &.facebook {
      border: solid 1px #4064ac;

      span {
        color: #4064ac;
      }
    }

    &.twitter {
      border: solid 1px #1c9ceb;

      span {
        color: #1c9ceb;
      }
    }

    &.pinterest {
      border: solid 1px #ba0a21;

      span {
        color: #ba0a21;
      }
    }

    &.weavex {
      border: solid 1px #4f46e5;

      span {
        color: #4f46e5;
      }
    }

    &:hover {
      background: $white;
    }

    [class^='icon'] {
      font-size: 1.125rem;
    }

    span.text {
      font-family: $font-family-sans-serif;
      font-weight: 600;
      padding-left: 0.75rem;
    }
  }
</style>
