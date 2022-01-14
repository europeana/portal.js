<template>
  <ContentCard
    :title="item.dcTitleLangAware || item.dcDescriptionLangAware"
    :url="url"
    :image-url="imageUrl"
    :texts="texts"
    :hits-text="hitsText"
    :class="cardClass"
    :limit-values-within-each-text="3"
    :omit-all-uris="true"
    :blank-image-height="280"
    :variant="variant"
    :lazy="lazy"
    :sub-title="subTitle"
  >
    <template #buttons>
      <div
        :class="{ 'data-and-buttons-wrapper d-flex': variant === 'list' }"
      >
        <RightsStatement
          v-if="rights"
          :rights-statement-url="rights"
          replace-icon="icon-license"
        />
        <span
          v-if="type"
          class="d-inline-flex align-items-center"
        >
          <span class="icon-file" />{{ type }}</span>
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
          @like="$emit('like', identifier)"
          @unlike="$emit('unlike', identifier)"
        />
      </div>
    </template>
  </ContentCard>
</template>

<script>
  import { genericThumbnail } from '@/plugins/europeana/thumbnail';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'ItemPreviewCard',

    components: {
      ContentCard,
      RecommendationButtons: () => import('../recommendation/RecommendationButtons'),
      UserButtons: () => import('../account/UserButtons'),
      RightsStatement: () => import('../generic/RightsStatement')
    },

    props: {
      // item expects an object containing minimal-profile item metadata
      item: {
        type: Object,
        required: true
      },
      hitSelector: {
        type: Object,
        default: null
      },
      variant: {
        type: String,
        default: 'default' // other options: entity, mini, list
      },
      lazy: {
        type: Boolean,
        default: true
      },
      showPins: {
        type: Boolean,
        default: false
      },
      enableAcceptRecommendation: {
        type: Boolean,
        default: false
      },
      enableRejectRecommendation: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      texts() {
        if (this.variant === 'similar' || this.variant === 'explore') {
          return [];
        }

        const texts = [];
        if (this.item.dcCreatorLangAware) {
          texts.unshift(this.item.dcCreatorLangAware);
        }

        if (this.variant === 'list') {
          if (!this.hitSelector && this.item.dcDescriptionLangAware) {
            texts.unshift(this.item.dcDescriptionLangAware);
          }
        } else {
          texts.push(this.item.dataProvider);
        }

        return texts;
      },

      hitsText() {
        return this.variant === 'list' ? this.hitSelector : null;
      },

      cardClass() {
        return this.variant === 'list' ? 'mx-0' : null;
      },

      identifier() {
        return this.item.id.replace('http://data.europeana.eu/item/', '');
      },

      url() {
        return { name: 'item-all', params: { pathMatch: this.identifier.slice(1) } };
      },

      imageUrl() {
        const size = 'w400';

        return this.item.edmPreview ?
          `${this.item.edmPreview[0]}&size=${size}` :
          genericThumbnail(this.item.id, { type: this.item.type, size });
      },

      subTitle() {
        return this.variant === 'list' ? langMapValueForLocale(this.item.dataProvider, this.$i18n.locale).values[0] : null;
      },

      rights() {
        return this.variant === 'list' ? this.item.rights[0] : null;
      },

      type() {
        return this.variant === 'list' ? this.item.type : null;
      }
    }
  };
</script>

<docs lang="md">
  Variant "list":
  ```jsx
  <ItemPreviewCard
    variant="list"
    :item="{ dataProvider: ['United Archives / WHA'],
          dcCreatorLangAware: { en: ['United Archives / WHA'] },
          dcDescriptionLangAware: { de: ['French, Coloured illustration, dated circa 1884, depicting a frilled-necked lizard (Chlamydosaurus kingii), also known as the frilled lizard, frilled dragon or frilled agama, is a species of lizard which is found mainly in northern Australia and southern N…'] },
          dcTitleLangAware: { en: ['illustration, circa 1884,depicting a frilled-necked lizard'] },
          edmPreview: ['https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Funitedarchives.noip.me%2FPagodeEU%2FWHA_112_0849_PagEU_EN.jpg&type=IMAGE'],
          id: '/2024909/photography_ProvidedCHO_United_Archives___WHA_02404781',
          type: 'IMAGE',
          rights: ['http://creativecommons.org/licenses/by-sa/3.0/'] }"
  />
  ```
</docs>
