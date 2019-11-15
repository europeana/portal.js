<template>
  <b-card
    class="text-left content-card"
    data-qa="content card"
    no-body
    :class="{ 'related-card' : isRelated }"
    :style="isRelated && imageUrl && cardImageStyle"
  >
    <SmartLink
      :destination="url"
      link-class="card-link"
    >
      <div
        v-if="imageUrl"
        :aria-label="title"
        :style="!isRelated && cardImageStyle"
        class="card-img"
        thumbnail
      />
      <b-img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="title"
        thumbnail
        fluid
      />
      <b-card-body>
        <b-card-title>
          {{ title | truncate(90, $t('formatting.ellipsis')) }}
        </b-card-title>
        <time
          v-if="datetime"
          class="font-weight-bold pb-3"
          data-qa="date"
          :datetime="datetime"
        >
          {{ $d(new Date(datetime), 'short') }}
        </time>
        <template v-if="texts.length > 0">
          <b-card-text
            v-for="(text, index) in texts"
            :key="index"
          >
            {{ text | truncate(255, $t('formatting.ellipsis')) }}
          </b-card-text>
        </template>
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  import SmartLink from './SmartLink';

  export default {
    components: {
      SmartLink
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      texts: {
        type: Array,
        default: () => []
      },
      url: {
        type: [String, Object],
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      imageContentType: {
        type: String,
        default: null
      },
      datetime: {
        type: String,
        default: ''
      },
      isRelated: {
        type: Boolean,
        default: false
      },
      thumbnail: {
        type: String,
        default: ''
      }
    },
    computed: {
      cardImageStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      },
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType);
      }
    }
  };
</script>
