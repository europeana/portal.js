<template>
  <ContentCard
    ref="card"
    :title="title"
    :url="selectState ? '' : url"
    :image-url="imageUrl"
    :texts="texts"
    :hit-text="hitText"
    :limit-values-within-each-text="3"
    :omit-all-uris="true"
    :variant="variant"
    :lazy="lazy"
    :sub-title="subTitle"
    :media-type="type"
    :offset="offset"
    :select-state="selectState"
    :identifier="identifier"
  >
    <template
      v-if="variant === 'list'"
      #footer
    >
      <div
        class="data-and-buttons-wrapper d-flex"
        @click.stop=""
      >
        <RightsStatement
          v-if="rights"
          :rights-statement-url="rights"
          variant="simple"
        />
        <span
          v-if="type"
          class="d-inline-flex align-items-center text-uppercase"
        >
          <span class="icon-file" />{{ type }}
        </span>
        <UserButtons
          v-if="!selectState"
          :identifier="identifier"
          :show-pins="showPins"
          :show-move="showMove"
          :show-remove="showRemove"
          :button-text="true"
          button-variant="light-flat"
        />
      </div>
    </template>
    <template
      v-else-if="!selectState && variant !== 'list'"
      #image-overlay
    >
      <div
        @click.stop=""
      >
        <RecommendationButtons
          v-if="enableAcceptRecommendation || enableRejectRecommendation"
          :identifier="identifier"
          :enable-accept-button="enableAcceptRecommendation"
          :enable-reject-button="enableRejectRecommendation"
        />
        <UserButtons
          v-else
          :identifier="identifier"
          :show-pins="showPins"
          :show-move="showMove"
          :show-remove="showRemove"
        />
      </div>
    </template>
  </ContentCard>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';

  import ContentCard from '../content/ContentCard';

  export default {
    name: 'ItemPreviewCard',

    components: {
      ContentCard,
      RecommendationButtons: () => import('../recommendation/RecommendationButtons'),
      RightsStatement: () => import('../generic/RightsStatement'),
      UserButtons: () => import('../user/UserButtons')
    },

    props: {
      /**
       * Item the card links to
       * expects an object containing minimal-profile item metadata
       */
      item: {
        type: Object,
        required: true
      },
      /**
       * Hit from a search to highlight in the item description
       * Only used on list variant
       */
      hitSelector: {
        type: Object,
        default: null
      },
      /**
       * Style variant to use
       * @values default, entity, mini, mosaic, list
       */
      variant: {
        type: String,
        default: 'default'
      },
      /**
       * If `true`, image will be lazy-loaded
       */
      lazy: {
        type: Boolean,
        default: true
      },
      /**
       * If `true`, pin button will be rendered
       */
      showPins: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, move button will be rendered
       */
      showMove: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, remove button will be rendered
       */
      showRemove: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, accept recommendation (thumb up) button will be rendered
       */
      enableAcceptRecommendation: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, reject recommendation (thumb down) button will be rendered
       */
      enableRejectRecommendation: {
        type: Boolean,
        default: false
      },
      /**
       * Offset, used for random color picking
       */
      offset: {
        type: Number,
        default: null
      },
      /**
       * Event listener to call when item receives `click` event
       *
       * Listener will receive item ID as argument
       */
      onClickCard: {
        type: Function,
        default: null
      },
      /**
       * Event listener to call when item receives `auxclick` event
       *
       * Listener will receive item ID as argument
       */
      onAuxClickCard: {
        type: Function,
        default: null
      },
      /**
       * Hash to include in router link to item
       */
      routeHash: {
        type: String,
        default: undefined
      },
      /**
       * Query to include in router link to item
       */
      routeQuery: {
        type: [Object, String],
        default: undefined
      },
      /**
       * Select state for multi-select
       */
      selectState: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      dcTitle() {
        return this.depublishedItem ?
          { [this.$i18n.locale]: [this.$t('record.status.depublished')] } :
          this.item.dcTitleLangAware;
      },

      title() {
        return this.dcTitle || this.item.dcDescriptionLangAware;
      },

      depublishedItem() {
        const itemProperties = Object.keys(this.item);
        return (itemProperties.length === 1) && (itemProperties[0] === 'id');
      },

      texts() {
        const texts = [];
        if (this.variant === 'list') {
          if (!this.hitSelector && this.item.dcDescriptionLangAware) {
            texts.unshift(this.item.dcDescriptionLangAware);
          }
        } else {
          if (this.item.dcCreatorLangAware) {
            texts.unshift(this.item.dcCreatorLangAware);
          }
          texts.push(this.item.dataProvider);
        }

        return texts;
      },

      hitText() {
        return this.variant === 'list' ? this.hitSelector : null;
      },

      identifier() {
        return this.item.id.replace('http://data.europeana.eu/item/', '');
      },

      url() {
        return {
          hash: this.routeHash,
          name: 'item-all',
          params: { pathMatch: this.identifier.slice(1) },
          query: this.routeQuery
        };
      },

      imageUrl() {
        return this.$apis.thumbnail.edmPreview(this.item.edmPreview?.[0], { size: 400 });
      },

      subTitle() {
        return this.variant === 'list' ? langMapValueForLocale(this.item.dataProvider, this.$i18n.locale).values[0] : null;
      },

      rights() {
        return this.variant === 'list' ? this.item.rights?.[0] : null;
      },

      type() {
        return this.item.type;
      }
    },

    mounted() {
      if (this.onClickCard) {
        this.$refs.card.$el.addEventListener('click', () => this.onClickCard(this.identifier));
      }
      if (this.onAuxClickCard) {
        this.$refs.card.$el.addEventListener('auxclick', () => this.onAuxClickCard(this.identifier));
      }
    }
  };
</script>

<docs lang="md">
  Variant "default":
  ```jsx
  <ItemPreviewCard
    :item="itemPreviewCardData"
  />
  ```
  Variant "default" for editors with pinning enabled:
  ```jsx
  <ItemPreviewCard
    :item="itemPreviewCardData"
    :showPins="true"
  />
  ```
  Variant "default" with accept and reject recommendations enabled:
  ```jsx
  <ItemPreviewCard
    :item="itemPreviewCardData"
    :enableAcceptRecommendation="true"
    :enableRejectRecommendation="true"
  />
  ```
  Variant "default" in select state:
  ```jsx
  <ItemPreviewCard
    :item="itemPreviewCardData"
    :selectState="true"
  />
  ```
  Variant "list":
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="itemPreviewCardData"
  />
  ```
  Variant "list" for editors with pinning enabled:
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="itemPreviewCardData"
    :showPins="true"
  />
  ```
  Variant "list" in select state:
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="itemPreviewCardData"
    :selectState="true"
  />
  ```
  Variant "mosaic":
  ```jsx
  <ItemPreviewCard
    variant="mosaic"
    :item="itemPreviewCardData"
  />
  ```
  Variant "mosaic" for editors with pinning enabled:
  ```jsx
  <ItemPreviewCard
    variant="mosaic"
    :item="itemPreviewCardData"
    :showPins="true"
  />
  ```
  Variant "mosaic" in select state:
  ```jsx
  <ItemPreviewCard
    variant="mosaic"
    :item="itemPreviewCardData"
    :selectState="true"
  />
  ```
</docs>
