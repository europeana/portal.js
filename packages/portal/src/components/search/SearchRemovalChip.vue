<template>
  <LinkBadge
    :title="title"
    :link-to="linkTo"
    :img="img"
    :type="type"
    :badge-variant="badgeVariant"
    data-qa="removal chip"
    :click-event-handler="clickEventHandler"
  >
    <span class="icon icon-clear" />
  </LinkBadge>
</template>

<script>
  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'SearchRemovalChip',

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
      },
      type: {
        type: String,
        default: null
      },
      /**
       * The variant used for the badge.
       */
      badgeVariant: {
        type: String,
        default: 'light'
      }
    },

    methods: {
      clickEventHandler() {
        this.$store.commit('search/setLoggableInteraction', true);
        if (this.$matomo) {
          this.$matomo.trackEvent('Remove_search_criterion', 'Click remove search criteria', this.linkTo);
        }
      }
    }
  };
</script>
