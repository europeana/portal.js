<template>
  <b-badge
    :to="$link.to(linkTo)"
    :href="$link.href(linkTo)"
    pill
    variant="light"
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
    <span class="icon icon-clear clear-indicator" />
  </b-badge>
</template>

<script>
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'RemovalChip',

    props: {
      title: {
        type: [String, Object],
        required: true
      },
      linkTo: {
        type: [String, Object],
        default: null
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

  // TODO: Remove the .clear-indicator, prefer to use the .close style from EC-5678
  .clear-indicator {
    background-color: $mediumgrey;
    color: $white;
    border-radius: $border-radius-large;
    margin-left: 4px;
  }
  .badge-light { text-transform: none; }
</style>
