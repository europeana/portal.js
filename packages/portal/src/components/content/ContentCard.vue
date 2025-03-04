<template>
  <b-card
    v-b-tooltip.bottom="tooltipTitle"
    class="text-left content-card"
    data-qa="content card"
    no-body
    :class="cardClass"
    :title="tooltipTitle"
  >
    <div class="card-wrapper">
      <MediaDefaultThumbnail
        v-if="variant !== 'mini'"
        v-show="!cardImageUrl"
        :media-type="mediaType"
        :offset="offset"
      />
      <div
        v-if="cardImageUrl"
        class="card-img"
        :class="{ logo }"
      >
        <ImageOptimised
          :src="cardImageUrl"
          :width="imageWidthPerVariant"
          :height="imageHeightPerVariant"
          :content-type="imageContentType"
          :contentful-image-crop-presets="contentfulImageCropPresets"
          :image-sizes="imageSizes"
          :picture-source-media-resolutions="[1, 2]"
          :lazy="lazy"
          @error.native="imageNotFound"
          @load.native="imageLoaded"
        />
      </div>
      <component
        :is="selectState ? 'ItemSelectCheckbox' : url ? 'SmartLink' : 'div'"
        v-if="(variant === 'mosaic') || !displayTitle"
        :destination="url"
        :identifier="selectState && identifier"
        class="card-link no-title"
      >
        <span
          v-if="displayTitle"
          :lang="langAttribute(displayTitle.code)"
        >
          {{ truncate(displayTitle.value, 90) }}
        </span>
      </component>
      <b-card-body
        v-if="variant !== 'mosaic'"
        data-qa="card body"
      >
        <b-card-sub-title
          v-if="(displaySubTitle && variant !== 'mini') && showSubtitle"
          sub-title-tag="div"
          sub-title-text-variant="default"
          class="mt-0"
        >
          {{ displaySubTitle }}
        </b-card-sub-title>
        <div class="title-texts-wrapper">
          <b-card-title
            v-if="displayTitle"
            title-tag="div"
            data-qa="card title"
            :lang="langAttribute(displayTitle.code)"
          >
            <component
              :is="selectState ? 'ItemSelectCheckbox' : url ? 'SmartLink' : 'div'"
              :destination="url"
              :link-class="url && 'card-link'"
              :title="(variant === 'mosaic' && displayTitle) ? displayTitle.value : null"
              :identifier="selectState && identifier"
            >
              <span>
                {{ truncate(displayTitle.value, 90) }}
              </span>
            </component>
          </b-card-title>
          <b-card-text
            v-if="hitText"
            text-tag="div"
            data-qa="highlighted search term"
          >
            <p>
              {{ hitTextPrefix }}<strong class="has-text-highlight">{{ hitText.exact }}</strong>{{ hitTextSuffix }}
            </p>
          </b-card-text>
          <template v-if="displayTexts.length > 0">
            <b-card-text
              v-for="(text, index) in displayTexts"
              :key="index"
              :lang="langAttribute(text.code)"
              text-tag="div"
            >
              <!-- eslint-disable vue/no-v-html -->
              <p
                v-html="cardText(text.values)"
              />
            <!-- eslint-enable vue/no-v-html -->
            </b-card-text>
          </template>
        </div>
        <client-only>
          <!-- @slot footer rendered at the bottom left of the card, client-side only -->
          <slot name="footer" />
        </client-only>
      </b-card-body>
    </div>
    <client-only>
      <!-- @slot image-overlay rendered over the card, client-side only -->
      <slot name="image-overlay" />
    </client-only>
  </b-card>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import SmartLink from '../generic/SmartLink';
  import langAttributeMixin from '@/mixins/langAttribute';
  import stripMarkdown from '@/utils/markdown/strip.js';
  import truncate from '@/utils/text/truncate.js';
  import { langMapValueForLocale } from '@europeana/i18n';

  const HIT_TEXT_AFFIX_MAX_WORDS = 15;

  export default {
    name: 'ContentCard',

    components: {
      ClientOnly,
      SmartLink,
      MediaDefaultThumbnail: () => import('@/components/media/MediaDefaultThumbnail'),
      ImageOptimised: () => import('@/components/image/ImageOptimised'),
      ItemSelectCheckbox: () => import('@/components/item/ItemSelectCheckbox')
    },

    mixins: [
      langAttributeMixin
    ],

    props: {
      /**
       * Card title
       *
       * If an object is supplied, it is expected to be a LangMap.
       */
      title: {
        type: [String, Object],
        default: ''
      },
      /**
       * Card subtitle
       */
      subTitle: {
        type: String,
        default: null
      },
      /**
       * Card texts
       *
       * Each element may be a string, an array of strings, or a LangMap
       */
      texts: {
        type: Array,
        default: () => []
      },
      /**
       * Hit from a search to highlight in the card texts
       */
      hitText: {
        type: Object,
        default: null
      },
      /**
       * URL for the card to link to
       *
       * An object should be a Vue route
       */
      url: {
        type: [String, Object],
        default: ''
      },
      /**
       * URL of an image to display
       */
      imageUrl: {
        type: String,
        default: ''
      },
      /**
       * Content type of the image
       */
      imageContentType: {
        type: String,
        default: null
      },
      /**
       * Width of the image
       */
      imageWidth: {
        type: Number,
        default: 520
      },
      /**
       * Height of the image
       */
      imageHeight: {
        type: Number,
        default: 338
      },
      /**
       * Image crop presets for optimised images
       *
       */
      contentfulImageCropPresets: {
        type: Object,
        default: () => ({ 'small': { w: 520, h: 338, fit: 'fill', f: 'face' } })
      },
      /**
       * Image sizes for optimised images
       */
      imageSizes: {
        type: String,
        default: null
      },
      /**
       * If `true`, image will be lazy-loaded
       */
      lazy: {
        type: Boolean,
        default: true
      },
      /**
       * If `true`, subtitle will be shown
       */
      showSubtitle: {
        type: Boolean,
        default: true
      },
      /**
       * Style variant to use
       * @values default, mini, list, mosaic
       */
      variant: {
        type: String,
        default: 'default'
      },
      /**
       * If `true`, will omit all URIs from texts
       */
      omitAllUris: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, will omit URIs from texts only if other values are present
       */
      omitUrisIfOtherValues: {
        type: Boolean,
        default: false
      },
      /**
       * For each element of `texts`, limit the number of values shown
       *
       * Default is no limit
       */
      limitValuesWithinEachText: {
        type: Number,
        default: -1
      },
      /**
       * If `true`, the image is a logo and will be styled differently
       */
      logo: {
        type: Boolean,
        default: false
      },
      /**
       * Type of media
       */
      mediaType: {
        type: String,
        default: null
      },
      /**
       * Offset, used for random color picking
       */
      offset: {
        type: Number,
        default: null
      },
      /**
       * Select state for multi-select
       */
      selectState: {
        type: Boolean,
        default: false
      },
      /**
       * Item identifier
       */
      identifier: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        cardImageUrl: this.imageUrl,
        displayLabelTypes: 'exhibitions|galleries|blog|collections|stories',
        // hit prefix & suffix can be overly long for our display purposes;
        // limit to max num of words each
        hitTextPrefix: this.hitText?.prefix?.split(/\s/).slice(-HIT_TEXT_AFFIX_MAX_WORDS).join(' '),
        hitTextSuffix: this.hitText?.suffix?.split(/\s/).slice(0, HIT_TEXT_AFFIX_MAX_WORDS).join(' ')
      };
    },
    computed: {
      cardClass() {
        return `${this.variant}-card`;
      },

      displayTitle() {
        if (!this.title) {
          return null;
        } else if (typeof this.title === 'string') {
          return { value: this.title, code: null };
        } else {
          const langMapValue = langMapValueForLocale(this.title, this.$i18n.locale);
          return { value: langMapValue.values[0], code: langMapValue.code };
        }
      },

      displaySubTitle() {
        return this.subTitle || this.displayLabel;
      },

      displayLabel() {
        if (!this.displayLabelType) {
          return false;
        }

        if (this.displayLabelType === 'collections') {
          return this.$t(`cardLabels.${this.displayLabelTypeCollections}`);
        }

        if (this.displayLabelType === 'blog') {
          return this.$tc('stories.stories', 1);
        }

        return this.$tc(`${this.displayLabelType}.${this.displayLabelType}`, 1);
      },

      displayLabelTypeCollections() {
        return typeof this.url === 'object' ? this.url.params.type : this.url.split('/').slice(-2, -1);
      },

      displayLabelType() {
        return this.displayLabelMatch?.[1];
      },

      displayLabelMatch() {
        return typeof this.url === 'object' ? this.displayLabelMatchObject : this.displayLabelMatchString;
      },

      displayLabelMatchObject() {
        return this.url.name.match(new RegExp(`(${this.displayLabelTypes})`));
      },

      displayLabelMatchString() {
        return this.url?.match(new RegExp(`/(${this.displayLabelTypes})[/.]`));
      },

      displayTexts() {
        return this.texts.filter(Boolean).map((value) => {
          if (typeof value === 'string') {
            return { values: [value], code: null };
          } else if (Array.isArray(value)) {
            return { values: value, code: null };
          } else {
            return langMapValueForLocale(value, this.$i18n.locale, { omitUrisIfOtherValues: this.omitUrisIfOtherValues, omitAllUris: this.omitAllUris });
          }
        }).filter((displayText) => displayText.values.length > 0);
      },

      tooltipTexts() {
        return this.displayTexts.map(text => text.values).join(' - ');
      },

      tooltipTitle() {
        if (this.variant === 'mosaic') {
          if (this.displayTitle?.value && this.tooltipTexts) {
            return `${this.displayTitle.value} - ${this.tooltipTexts}`;
          }
          return this.displayTitle?.value || this.tooltipTexts;
        }
        return null;
      },

      imageWidthPerVariant() {
        if (this.variant === 'mini') {
          return 120;
        } else if (this.variant === 'list') {
          return 240;
        } else {
          return this.imageWidth;
        }
      },

      imageHeightPerVariant() {
        if (this.variant === 'mini') {
          return 120;
        } else if (this.variant === 'list') {
          return 240;
        } else {
          return this.imageHeight;
        }
      }
    },

    watch: {
      imageUrl() {
        this.cardImageUrl = this.imageUrl;
      }
    },

    methods: {
      truncate,

      cardText(values) {
        const limited = (this.limitValuesWithinEachText > -1) ? values.slice(0, this.limitValuesWithinEachText) : [].concat(values);
        if (values.length > limited.length) {
          limited.push('…');
        }
        const joined = limited.join('; ');
        const stripped = stripMarkdown(joined);
        return truncate(stripped, 255);
      },

      redrawMasonry() {
        if (this.$redrawVueMasonry) {
          this.$nextTick(() => {
            this.$redrawVueMasonry();
          });
        }
      },

      imageNotFound() {
        this.cardImageUrl = '';
        this.redrawMasonry();
      },

      imageLoaded(event) {
        // ignore b-img-lazy's blank placeholder images
        if (!event.target.src.startsWith('data:')) {
          this.redrawMasonry();
        }
      }
    }
  };
</script>

<docs lang="md">
  Variant "default":
  ```jsx
    <div>
    <ContentCard
      title="Title"
      :image-url="thumbnails[0]"
      :texts="['Texts on a content card']"
      class="mr-3 mb-3"
      style="max-width: 18rem;"
      url="/"
    />
    <ContentCard
      variant="mini"
      class="mr-3 mb-3"
      style="max-width: 18rem;"
      title="Title of a mini variant content card"
      :image-url="thumbnails[1]"
      url="/"
    />
    <ContentCard
      variant="mosaic"
      class="mr-3 mb-3"
      style="max-width: 18rem;"
      title="Title of a mosaic variant content card"
      :texts="['Texts on mosaic card appear in the tooltip']"
      :image-url="thumbnails[2]"
      url="/"
    />
    <ContentCard
      variant="list"
      class="mr-3 mb-3"
      title="Title of a list variant content card"
      :image-url="thumbnails[3]"
      :hitText="{ prefix: 'This shows a ', exact: 'Hit-Highlight', suffix: ' appearing in the middle of the description!' }"
      url="/"
    />
    <ContentCard
      class="mr-3 mb-3"
      style="max-width: 18rem;"
      title="Title of a default card without displayable media"
      :texts="['Texts on a content card']"
      url="/"
      media-type="SOUND"
    />
  </div>
  ```
</docs>
