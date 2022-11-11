<template>
  <b-card
    class="text-left content-card"
    data-qa="content card"
    no-body
    :class="cardClass"
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
        <b-img-lazy
          v-if="lazy"
          :src="optimisedImageUrl"
          :blank-width="blankImageWidth"
          :blank-height="blankImageHeight"
          :width="imageWidth"
          :height="imageHeight"
          :alt="imageAlt"
          @error.native="imageNotFound"
          @load.native="imageLoaded"
        />
        <b-img
          v-else
          :src="optimisedImageUrl"
          :width="imageWidth"
          :height="imageHeight"
          :alt="imageAlt"
          @error="imageNotFound"
          @load="imageLoaded"
        />
      </div>
      <SmartLink
        v-if="(variant === 'mosaic') || !displayTitle"
        :destination="url"
        link-class="card-link no-title"
        :title="(variant === 'mosaic' && displayTitle) ? displayTitle.value : null"
      >
        <span
          v-if="displayTitle"
          :lang="displayTitle.code"
        >
          {{ displayTitle.value | truncate(90, $t('formatting.ellipsis')) }}
        </span>
      </SmartLink>
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
            :lang="displayTitle.code"
          >
            <SmartLink
              :destination="url"
              link-class="card-link"
              :title="(variant === 'mosaic' && displayTitle) ? displayTitle.value : null"
            >
              <span>
                {{ displayTitle.value | truncate(90, $t('formatting.ellipsis')) }}
              </span>
            </SmartLink>
          </b-card-title>
          <b-card-text
            v-if="hitsText"
            text-tag="div"
            data-qa="highlighted search term"
          >
            <p>
              {{ hitsText.prefix }}<strong class="has-text-highlight">{{ hitsText.exact }}</strong>{{ hitsText.suffix }}
            </p>
          </b-card-text>
          <template v-if="displayTexts.length > 0">
            <b-card-text
              v-for="(text, index) in displayTexts"
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
  import SmartLink from './SmartLink';
  import stripMarkdownMixin from '@/mixins/stripMarkdown';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import themes from '@/plugins/europeana/themes';

  export default {
    name: 'ContentCard',

    components: {
      ClientOnly,
      SmartLink,
      MediaDefaultThumbnail: () => import('../media/MediaDefaultThumbnail')
    },

    mixins: [
      stripMarkdownMixin
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
       * Hits from a search to highlight in the card texts
       */
      hitsText: {
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
        default: null
      },
      /**
       * Height of the image
       */
      imageHeight: {
        type: Number,
        default: null
      },
      /**
       * Image alt text
       */
      imageAlt: {
        type: String,
        default: ''
      },
      /**
       * Image optimisation options
       *
       * Passed to `optimisedImageUrl` filter
       */
      imageOptimisationOptions: {
        type: Object,
        default: () => ({})
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
       * Height of image placeholder when lazy-loading image
       */
      blankImageHeight: {
        type: Number,
        default: null
      },
      /**
       * Width of image placeholder when lazy-loading image
       */
      blankImageWidth: {
        type: Number,
        default: null
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
      }
    },
    data() {
      return {
        cardImageUrl: this.imageUrl,
        displayLabelTypes: 'exhibitions|galleries|blog|collections',
        themes: themes.map(theme => theme.id)
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
          const entityId = (typeof this.url === 'string') ?
            this.url.split('/').pop().split('-').shift() :
            this.url.params.pathMatch;

          // TODO: remove when thematic collections topics get their own 'theme' type
          return this.themes.includes(entityId) ?
            this.$t('cardLabels.theme') :
            this.$t(`cardLabels.${this.displayLabelTypeCollections}`);
        }

        if (this.displayLabelType === 'blog') {
          return this.$tc('blog.posts', 1);
        }

        return this.$tc(`${this.displayLabelType}.${this.displayLabelType}`, 1);
      },

      displayLabelTypeCollections() {
        return typeof this.url === 'object' ? this.url.params.type : this.url.split('/').slice(-2, -1);
      },

      displayLabelType() {
        return this.displayLabelMatch ? this.displayLabelMatch[1] : false;
      },

      displayLabelMatch() {
        return typeof this.url === 'object' ? this.displayLabelMatchObject : this.displayLabelMatchString;
      },

      displayLabelMatchObject() {
        return this.url.name.match(new RegExp(`(${this.displayLabelTypes})`));
      },

      displayLabelMatchString() {
        return this.url.match(new RegExp(`/(${this.displayLabelTypes})[/.]`));
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

      optimisedImageUrl() {
        if (!this.$contentful.assets.isValidUrl(this.imageUrl)) {
          return this.imageUrl;
        }
        return this.$contentful.assets.optimisedSrc(
          { url: this.imageUrl, contentType: this.imageContentType },
          { w: this.imageOptimisationOptions?.width, h: this.imageOptimisationOptions?.height }
        );
      }
    },

    watch: {
      imageUrl() {
        this.cardImageUrl = this.imageUrl;
      }
    },

    methods: {
      cardText(values) {
        const limited = (this.limitValuesWithinEachText > -1) ? values.slice(0, this.limitValuesWithinEachText) : [].concat(values);
        if (values.length > limited.length) {
          limited.push(this.$t('formatting.ellipsis'));
        }
        const joined = limited.join(this.$t('formatting.listSeperator') + ' ');
        const stripped = this.stripMarkdown(joined);
        return this.$options.filters.truncate(stripped, 255, this.$t('formatting.ellipsis'));
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
  <ContentCard
    title="Debarquement a l'Ile de Malte (Bonaparte landing on Malta)"
    image-url="https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fcollections.rmg.co.uk%2FmediaLib%2F323%2Fmedia-323744%2Flarge.jpg"
    :texts="['Royal Museums Greenwich']"
    url="https://www.europeana.eu/item/2022362/_Royal_Museums_Greenwich__http___collections_rmg_co_uk_collections_objects_147879"
  />
  ```

  Variant "mini":
  ```jsx
  <ContentCard
    variant="mini"
    title="Photograph"
    image-url="https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DRP-F-2000-21-40&type=IMAGE"
    url="https://www.europeana.eu/collections/topic/48"
  />
  ```

  Variant "mosaic":
  ```jsx
  <ContentCard
    variant="mosaic"
    title="Debarquement a l'Ile de Malte (Bonaparte landing on Malta)"
    image-url="https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fcollections.rmg.co.uk%2FmediaLib%2F323%2Fmedia-323744%2Flarge.jpg"
    url="https://www.europeana.eu/item/2022362/_Royal_Museums_Greenwich__http___collections_rmg_co_uk_collections_objects_147879"
  />
  ```

  Variant "list":
  ```jsx
  <ContentCard
    variant="list"
    title="Debarquement a l'Ile de Malte (Bonaparte landing on Malta)"
    image-url="https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fcollections.rmg.co.uk%2FmediaLib%2F323%2Fmedia-323744%2Flarge.jpg"
    :hitsText="{ prefix: 'This shows a ', exact: 'Hit-Highlight', suffix: ' appearing in the middle of the description!' }"
    url="https://www.europeana.eu/item/2022362/_Royal_Museums_Greenwich__http___collections_rmg_co_uk_collections_objects_147879"
  />
  ```
  Variant "default" with colored default thumbnail:
  ```jsx
  <ContentCard
    title="Debarquement a l'Ile de Malte (Bonaparte landing on Malta)"
    image-url="https://api.europeana.eu/thumbnail/v3/400/d141fa1321a1eb8f0527e6526b7b39b2"
    :texts="['Royal Museums Greenwich']"
    url="https://www.europeana.eu/item/2022362/_Royal_Museums_Greenwich__http___collections_rmg_co_uk_collections_objects_147879"
    media-type="SOUND"
  />
  ```
</docs>
