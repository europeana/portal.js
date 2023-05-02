<template>
  <div>
    <b-button
      v-for="(network, index) in networks"
      :key="index"
      v-b-tooltip.bottom
      :title="network.tooltip || ''"
      :class="`social-share mr-2 ${network.identifier}`"
      :data-qa="`share ${network.identifier} button`"
      :href="network.url"
      target="_blank"
      variant="outline-primary"
      :aria-label="$t('actions.shareOn', { social: network.name })"
      @click.native="trackShare(network)"
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
  import { VBTooltip } from 'bootstrap-vue';

  export default {
    name: 'SocialShare',

    directives: {
      'b-tooltip': VBTooltip
    },

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
    },

    methods: {
      trackShare(network) {
        this.$matomo && this.$matomo.trackEvent('Item_share', 'Click social share button', network.url);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icons';

  .btn {
    align-items: center;
    display: inline-flex;
    width: calc(100% / 3 - 10px);

    @media (max-width: $bp-small) {
      width: 100%;
      margin-bottom: 10px;
    }

    @media (min-width: $bp-4k) {
      width: calc(100% / 3 - 15px);
      margin-bottom: 15px;
      margin-right: 0.75rem !important;
    }

    &:hover {
      background: $white;
    }

    &:last-child {
      margin-right: 0 !important;
    }

    &.facebook {
      $facebook-blue: #3b5998;

      border: solid 1px $facebook-blue;
      color: $facebook-blue;

      &:not(:disabled):not(.disabled) {
        &:active,
        &.active {
          color: $facebook-blue;
          background-color: $white;
          border-color: $facebook-blue;
        }
      }
    }

    &.twitter {
      $twitter-blue: #00acee;
      border: solid 1px $twitter-blue;
      color: $twitter-blue;

      &:not(:disabled):not(.disabled) {
        &:active,
        &.active {
          color: $twitter-blue;
          background-color: $white;
          border-color: $twitter-blue;
        }
      }
    }

    &.pinterest {
      $pinterest-red: #e60023;

      border: solid 1px $pinterest-red;
      color: $pinterest-red;

      &:not(:disabled):not(.disabled) {
        &:active,
        &.active {
          color: $pinterest-red;
          background-color: $white;
          border-color: $pinterest-red;
        }
      }
    }

    &.weavex {
      $weavex-green: #3e861c;

      border: solid 1px $weavex-green;
      color: $weavex-green;

      &:not(:disabled):not(.disabled) {
        &:active,
        &.active {
          color: $weavex-green;
          background-color: $white;
          border-color: $weavex-green;
        }
      }

      .icon-weavex {
        font-size: $font-size-small;

        @media (min-width: $bp-4k) {
          font-size: $font-size-small-4k;
        }

        &::before {
          content: 'W';
          font-family: $font-family-sans-serif;
          font-weight: 800;
          font-style: italic;
        }
      }
    }

    [class^='icon'] {
      font-size: $font-size-base;

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
      }
    }

    span.text {
      font-family: $font-family-sans-serif;
      font-weight: 600;
      padding-left: 0.75rem;
    }
  }
</style>
