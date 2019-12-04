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
      <!-- TODO: replace aria-label with labelledby indicating the title element -->
      <div
        v-if="imageUrl"
        :aria-label="displayTitle"
        :style="!isRelated && cardImageStyle"
        class="card-img"
      />
      <b-card-body>
        <b-card-title>
          <template
            v-if="typeof displayTitle === 'string'"
          >
            {{ displayTitle | truncate(90, $t('formatting.ellipsis')) }}
          </template>
          <span
            v-else
            :lang="displayTitle.code"
          >
            {{ displayTitle.values[0] | truncate(90, $t('formatting.ellipsis')) }}
          </span>
        </b-card-title>
        <time
          v-if="datetime"
          class="font-weight-bold pb-3"
          data-qa="date"
          :datetime="datetime"
        >
          {{ $d(new Date(datetime), 'short') }}
        </time>
        <template v-if="displayTexts.length > 0">
          <template
            v-for="(text, index) in displayTexts"
          >
            <b-card-text
              v-if="typeof text === 'string'"
              :key="index"
            >
              {{ text | truncate(255, $t('formatting.ellipsis')) }}
            </b-card-text>
            <div
              v-else
              :key="index"
            >
              <b-card-text
                v-for="(langMapValue, langMapIndex) in text.values"
                :key="index + '.' + langMapIndex"
                :lang="text.code"
              >
                {{ langMapValue | truncate(255, $t('formatting.ellipsis')) }}
              </b-card-text>
            </div>
          </template>
        </template>
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  import SmartLink from './SmartLink';
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';

  export default {
    name: 'ContentCard',

    components: {
      SmartLink
    },

    props: {
      title: {
        // may be a string or a lang map
        type: [String, Object],
        default: ''
      },
      // each element may be a string, an array of strings, or a lang map
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
      }
    },

    computed: {
      cardImageStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      },

      displayTitle() {
        if (typeof this.title === 'string') {
          return this.title;
        } else {
          return langMapValueForLocale(this.title, this.$i18n.locale);
        }
      },

      // TODO: limit to three values, bearing in mind the need to annotate language
      //       of lang maps... (per former stringifyField in SearchResults.vue)
      displayTexts() {
        let texts = [];
        for (const value of this.texts) {
          if (typeof value === 'string') {
            texts.push(value);
          } else if (Array.isArray(value)) {
            texts = texts.concat(value);
          } else if (typeof value === 'object') {
            texts.push(langMapValueForLocale(value, this.$i18n.locale));
          } else {
            throw new TypeError(`Unsupported text value type: ${value}`);
          }
        }
        return texts;
      },

      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType);
      }
    }
  };
</script>
