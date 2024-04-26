<template>
  <SmartLink
    :destination="linkTo"
  >
    <b-badge
      pill
      :variant="badgeVariant"
      :class="{ 'img-chip': imageUrl }"
      :data-qa="localisedTitle.values[0] + ' related chip'"
      :lang="localisedTitle.code"
      @click.capture="clickEventHandler?.()"
    >
      <div
        v-if="imageUrl && type === 'Organization'"
        class="organisation-logo mr-2"
        data-qa="entity logo"
        :style="`background-image: url(${imageUrl})`"
      />
      <b-img
        v-else-if="imageUrl"
        :src="imageUrl"
        :srcset="imageSrcSet"
        sizes="(max-width 1920px) 28w,
        (max-width 2560) 45w,
        (min-width 2561) 67w"
        alt=""
        rounded="circle"
        class="mr-2"
        @error="imageNotFound"
      />
      <span>{{ localisedTitle.values[0] }}</span>
      <slot />
    </b-badge>
  </SmartLink>
</template>

<script>
  import SmartLink from './SmartLink';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'LinkBadge',

    components: {
      SmartLink
    },

    props: {
      linkTo: {
        type: [String, Object],
        default: null
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
        default: 'secondary'
      },
      clickEventHandler: {
        type: Function,
        default: null
      },
      imageSrcSet: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        imageUrl: this.img
      };
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
      imageNotFound() {
        this.imageUrl = '';
      }
    }
  };
</script>
