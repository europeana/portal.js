<template>
  <b-badge
    :to="$link.to(linkTo)"
    :href="$link.href(linkTo)"
    pill
    :variant="badgeVariant"
    :class="{ 'img-chip': img }"
    :data-qa="localisedTitle.values[0] + ' related chip'"
    :lang="localisedTitle.code"
    @click.native="trackClickEvent"
  >
    <div
      v-if="img && type === 'Organization'"
      class="organisation-logo mr-2"
      data-qa="entity logo"
      :style="`background-image: url(${img})`"
    />
    <b-img
      v-else-if="img"
      :src="img"
      alt=""
      rounded="circle"
      class="mr-2"
    />
    <span>{{ localisedTitle.values[0] }}</span>
  </b-badge>
</template>

<script>
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'RelatedChip',

    props: {
      linkTo: {
        type: String,
        default: ''
      },
      title: {
        type: [String, Object],
        required: true
      },
      id: {
        type: String,
        default: ''
      },
      img: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      badgeVariant: {
        type: String,
        default: 'primary'
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
          this.$matomo.trackEvent('Related_collections', 'Click related collection', this.linkTo);
        }
      }
    }
  };
</script>
