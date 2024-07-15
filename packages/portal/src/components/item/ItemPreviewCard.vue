<template>
  <ContentCard
    ref="card"
    :title="dcTitle || item.dcDescriptionLangAware"
    :url="url"
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
      v-else
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
      UserButtons: () => import('../user/UserButtons'),
      RightsStatement: () => import('../generic/RightsStatement')
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
      }
    },

    computed: {
      dcTitle() {
        return this.unpublishedItem ?
          { [this.$i18n.locale]: [this.$t('record.status.unpublished')] } :
          this.item.dcTitleLangAware;
      },

      unpublishedItem() {
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
        return { name: 'item-all', params: { pathMatch: this.identifier.slice(1) } };
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
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de:
          [`French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard,
          frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…`] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
  />
  ```
  Variant "default" for editors with pinning enabled:
  ```jsx
  <ItemPreviewCard
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de:
          [`French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard,
          frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…`] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
    :showPins="true"
  />
  ```
  Variant "default" with accept and reject recommendations enabled:
  ```jsx
  <ItemPreviewCard
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de:
          [`French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard,
          frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…`] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
    :enableAcceptRecommendation="true"
    :enableRejectRecommendation="true"
  />
  ```
  Variant "list":
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de:
          [`French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard,
          frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…`] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
  />
  ```
  Variant "list" for editors with pinning enabled:
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de:
          [`French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard,
          frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…`] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
    :showPins="true"
  />
  ```
</docs>
