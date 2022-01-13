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
  >
    <template #buttons>
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
    </template>
  </ContentCard>
</template>

<script>
  import { genericThumbnail } from '@/plugins/europeana/thumbnail';

  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'ItemPreviewCard',

    components: {
      ContentCard,
      RecommendationButtons: () => import('../recommendation/RecommendationButtons'),
      UserButtons: () => import('../account/UserButtons')
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
        default: 'default' // other options: entity, mini, image-grid, list
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
        const textlessVariants = ['similar', 'explore', 'image-grid'];
        if (textlessVariants.includes(this.variant)) {
          return [];
        }

        const texts = [].concat(this.item.dataProvider);
        if (this.item.dcCreatorLangAware) {
          texts.unshift(this.item.dcCreatorLangAware);
        }

        if (this.variant === 'list') {
          if (!this.hitSelector && this.item.dcDescriptionLangAware) {
            texts.unshift(this.item.dcDescriptionLangAware);
          }
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
      }
    }
  };
</script>
