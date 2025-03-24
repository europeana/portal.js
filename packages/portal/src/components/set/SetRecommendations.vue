<template>
  <b-row
    v-if="!$fetchState.pending && !$fetchState.error && (recommendations.length > 0)"
    class="recommendations"
  >
    <b-col>
      <h2 class="related-heading">
        {{ $t('items.recommended') }}
      </h2>
      <h5
        v-if="enableAcceptRecommendations || enableRejectRecommendations"
        class="related-subtitle"
        data-qa="recommendations disclaimer"
      >
        <span class="icon-info-outline" />
        {{ recommendationsDisclaimer }}
      </h5>
      <ItemPreviewCardGroup
        :items="recommendations"
        :enable-accept-recommendations="enableAcceptRecommendations"
        :enable-reject-recommendations="enableRejectRecommendations"
      />
    </b-col>
  </b-row>
</template>

<script>
  import ItemPreviewCardGroup from '../item/ItemPreviewCardGroup';

  export default {
    name: 'SetRecommendations',

    components: {
      ItemPreviewCardGroup
    },

    props: {
      identifier: {
        type: String,
        required: true
      },

      type: {
        type: String,
        required: true
      }
    },

    fetch() {
      return this.$apis.recommendation.recommend('set', this.identifier)
        .then((response) => {
          this.$store.commit('set/setActiveRecommendations', response.items);
        });
    },

    computed: {
      recommendations() {
        return this.$store.state.set.activeRecommendations || [];
      },
      recommendationsDisclaimer() {
        const texts = [];
        if (this.enableAcceptRecommendations) {
          texts.push(this.$t('recommendation.prompts.accept'));
        }
        if (this.enableRejectRecommendations) {
          texts.push(this.$t('recommendation.prompts.reject'));
        }
        return texts.join(' — ');
      },
      setIsEntityBestItems() {
        return this.type === 'EntityBestItemsSet';
      },
      enableAcceptRecommendations() {
        return this.setIsEntityBestItems ?
          this.$features.acceptEntityRecommendations :
          this.$features.acceptSetRecommendations;
      },
      enableRejectRecommendations() {
        return this.setIsEntityBestItems ?
          this.$features.rejectEntityRecommendations :
          this.$features.acceptSetRecommendations;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .recommendations h2 {
    color: $darkgrey;
    font-size: $font-size-medium;
  }
</style>
