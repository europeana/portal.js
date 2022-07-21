<template>
  <LinkBadge
    :title="title"
    :link-to="linkTo"
    :img="img"
    badge-variant="light"
    data-qa="removal chip"
    :click-event-handler="clickEventHandler"
  >
    <span class="icon icon-clear clear-indicator" />
  </LinkBadge>
</template>

<script>
  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'RemovalChip',

    components: {
      LinkBadge
    },

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

    methods: {
      clickEventHandler() {
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
    flex-shrink: 0;
  }
  .badge-light { text-transform: none; }
</style>
