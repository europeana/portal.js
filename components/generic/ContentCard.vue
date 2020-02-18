<template>
  <b-card
    class="text-left content-card"
    data-qa="content card"
    no-body
    :class="{ 'entity-card' : isEntity, 'mini-card' : isMini }"
  >
    <SmartLink
      :destination="url"
      link-class="card-link"
    >
      <b-img-lazy
        v-if="isEntity && cardImageUrl"
        :src="optimisedImageUrl"
        alt=""
        @error.native="imageNotFound"
      />
      <div
        v-if="cardImageUrl"
        class="card-img"
      >
        <b-img-lazy
          v-if="!isEntity"
          :src="optimisedImageUrl"
          :blank-height="imageBlankHeight"
          alt=""
        />
      </div>
      <b-card-body>
        <b-card-title
          v-if="displayTitle"
          title-tag="div"
          :lang="displayTitle.code"
        >
          {{ displayTitle.values[0] | truncate(90, $t('formatting.ellipsis')) }}
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
              :key="index"
              :lang="text.code"
              text-tag="div"
            >
              <!-- eslint-disable vue/no-v-html -->
              <p
                v-html="cardText(text.values)"
              />
              <!-- eslint-enable vue/no-v-html -->
            </b-card-text>
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
      imageOptimisationOptions: {
        type: Object,
        default: () => {}
      },
      imageBlankHeight: {
        type: Number,
        default: 0
      },
      datetime: {
        type: String,
        default: ''
      },
      isEntity: {
        type: Boolean,
        default: false
      },
      isMini: {
        type: Boolean,
        default: false
      },
      // TODO: instead of using isMini and isEntity, possibly refactor to use something like "variant"
      // as it cannot be isEntity and isMini at the same time for example
      omitUrisIfOtherValues: {
        type: Boolean,
        default: false
      },
      limitValuesWithinEachText: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        cardImageUrl: this.imageUrl
      };
    },

    computed: {
      displayTitle() {
        if (typeof this.title === 'string') {
          return { values: [this.title], code: null };
        } else {
          return langMapValueForLocale(this.title, this.$i18n.locale);
        }
      },

      displayTexts() {
        return this.texts.filter(Boolean).map((value) => {
          if (typeof value === 'string') {
            return { values: [value], code: null };
          } else if (Array.isArray(value)) {
            return { values: value, code: null };
          } else {
            return langMapValueForLocale(value, this.$i18n.locale, { omitUrisIfOtherValues: this.omitUrisIfOtherValues });
          }
        });
      },

      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType, this.imageOptimisationOptions);
      }
    },

    methods: {
      cardText(values) {
        const limited = (this.limitValuesWithinEachText > -1) ? values.slice(0, this.limitValuesWithinEachText) : [].concat(values);
        if (values.length > limited.length) limited.push(this.$t('formatting.ellipsis'));
        const joined = limited.join(this.$t('formatting.listSeperator') + ' ');
        const stripped = this.$options.filters.stripMarkdown(joined);
        return this.$options.filters.truncate(stripped, 255, this.$t('formatting.ellipsis'));
      },

      imageNotFound() {
        this.cardImageUrl = '';
      }
    }
  };
</script>
