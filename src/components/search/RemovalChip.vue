<template>
  <b-badge
    :to="$link.to(linkTo)"
    :href="$link.href(linkTo)"
    pill
    variant="light"
    class="mt-1 mr-2 font-weight-normal bg-white"
    :class="{ 'img-chip': img }"
    :data-qa="localisedTitle.values[0] + ' removal chip'"
    :lang="localisedTitle.code"
    @click.native="trackClickEvent"
  >
    <b-img
      v-if="img"
      :src="img"
      alt=""
      rounded="circle"
      class="mr-2"
    />
    {{ localisedTitle.values[0] }}
    <span class="icon icon-clear clear-indicator"/>
  </b-badge>
</template>

<script>
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'RemovalChip',

    props: {
      linkTo: {
        type: String,
        default: ''
      },
      title: {
        type: [String, Object],
        required: true
      },
      img: {
        type: String,
        default: ''
      }
    },

    computed: {
      localisedTitle() {
        if (typeof this.title === 'string') {
          return {
            values: [this.title],
            code: null
          };
        }
        return langMapValueForLocale(this.title, this.$i18n.locale);
      }
    },

    methods: {
      trackClickEvent() {
        if (this.$matomo) {
          this.$matomo.trackEvent('Remove_search_criterion', 'Click remove search criteria', this.linkTo);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .badge-light {
    color: $black;
    font-size: $font-size-small;
    border-radius: 1.125rem;
    border: solid 1px $lightbluemagenta;
    padding: 0.25rem 0.75rem;
    height: 2.25rem;
    min-width: 4rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition: $standard-transition;

    &:hover,
    &:focus {
      background: $smoke !important;
    }

    &.img-chip {
      padding: 0.25rem 0.75rem 0.25rem 0.25rem;
    }

    img {
      width: 28px;
      height: 28px;
      object-fit: cover;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .clear-indicator {
      background-color: $mediumgrey;
      color: $white;
      border-radius: $border-radius-large;
      margin-left: 4px;
    }
  }
</style>
