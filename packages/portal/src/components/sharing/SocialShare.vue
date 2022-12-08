<template>
  <div>
    <b-button
      v-for="(network, index) in networks"
      :key="index"
      :title="$t('actions.shareOn', { social: network.name })"
      :href="network.url"
      :class="`social-share mr-2 ${network.identifier}`"
      :data-qa="`share ${network.identifier} button`"
      variant="outline-primary"
      @click.native="$matomo && $matomo.trackEvent('Item_share', 'Click social share button', network.url);"
    >
      <span :class="`icon-${network.identifier}`" />
      <span
        class="text"
      >{{ network.name }}
      </span>
    </b-button>
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
  @import '@/assets/scss/icons';

  .btn {
    align-items: center;
    display: inline-flex;
    width: calc(100% / 3 - 10px);

    @media (max-width: $bp-small) {
      width: 100%;
      margin-bottom: 10px;
    }

    &:hover {
      background: $lightblue-light;
    }

    &:last-child {
      margin-right: 0 !important;
    }

    &.facebook {
      border: solid 1px #3B5998;

      span {
        color: #3B5998;
      }
    }

    &.twitter {
      border: solid 1px #00acee;

      span {
        color: #00acee;
      }
    }

    &.pinterest {
      border: solid 1px #e60023;

      span {
        color: #e60023;
      }
    }

    &.weavex {
      border: solid 1px #3E861C;
      text-transform: none;

      span {
        color: #3E861C;
      }

      .icon-weavex {
        font-size: $font-size-small;
        &::before {
          content: 'W';
          font-family: $font-family-sans-serif;
          font-weight: 800;
          font-style: italic;
        }
      }
    }

    [class^='icon'] {
      font-size: 1rem;
    }

    span.text {
      font-family: $font-family-sans-serif;
      font-weight: 600;
      padding-left: 0.75rem;
    }
  }
</style>
