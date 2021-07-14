<template>
  <ContentCard
    :title="value.dcTitleLangAware || value.dcDescriptionLangAware"
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
    <template v-slot:buttons>
      <client-only>
        <RecommendationButtons
          v-if="recommendedItem"
          v-model="identifier"
        />
        <UserButtons
          v-else
          v-model="identifier"
          :show-pins="showPins"
          @like="$emit('like', identifier)"
          @unlike="$emit('unlike', identifier)"
        />
      </client-only>
    </template>
  </ContentCard>
</template>

<script>
  import { genericThumbnail } from '@/plugins/europeana/thumbnail';

  import ClientOnly from 'vue-client-only';
  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'ItemPreviewCard',

    components: {
      ClientOnly,
      ContentCard,
      RecommendationButtons: () => import('../recommendation/RecommendationButtons'),
      UserButtons: () => import('../account/UserButtons')
    },

    props: {
      // v-model expects an object containing minimal-profile item metadata
      value: {
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
      recommendedItem: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      texts() {
        if (this.variant === 'similar' || this.variant === 'explore') {
          return [];
        }

        const texts = [].concat(this.value.dataProvider);
        if (this.value.dcCreatorLangAware) {
          texts.unshift(this.value.dcCreatorLangAware);
        }

        if (this.variant === 'list') {
          if (!this.hitSelector && this.value.dcDescriptionLangAware) {
            texts.unshift(this.value.dcDescriptionLangAware);
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
        return this.value.id.replace('http://data.europeana.eu/item/', '');
      },

      url() {
        return { name: 'item-all', params: { pathMatch: this.identifier.slice(1) } };
      },

      imageUrl() {
        const size = 'w400';

        return this.value.edmPreview ?
          `${this.value.edmPreview[0]}&size=${size}` :
          genericThumbnail(this.value.id, { type: this.value.type, size });
      }
    }
  };
</script>
