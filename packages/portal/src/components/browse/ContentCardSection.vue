<template>
  <section
    v-if="section"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-6">
      <h2
        data-qa="section headline"
      >
        {{ section.headline }}
      </h2>
      <p>
        {{ section.text }}
      </p>
    </div>
    <div class="col-12">
      <b-card-group
        class="card-deck-4-cols"
        deck
        data-qa="section group"
      >
        <template v-if="isPeopleSection">
          <ContentCard
            v-for="(card, index) in cards"
            :key="index"
            :title="card.name"
            :url="entityRouterLink(card.identifier, card.slug)"
            :image-url="card.entityImage"
            :image-optimisation-options="{ width: 510 }"
            variant="mini"
          />
        </template>
        <template v-else>
          <BrowseContentCard
            v-for="(card, index) in cards"
            :key="index"
            :fields="card"
            :card-type="card['__typename']"
            :variant="card['__variant']"
          />
        </template>
      </b-card-group>
      <SmartLink
        v-if="section.moreButton"
        :destination="section.moreButton.url"
        class="btn btn-outline-secondary"
        data-qa="section more button"
      >
        {{ section.moreButton.text }}
      </SmartLink>
    </div>
  </section>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import BrowseContentCard from './BrowseContentCard';
  import SmartLink from '../generic/SmartLink';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';

  import { entityParamsFromUri } from '@/plugins/europeana/entity';

  export default {
    components: {
      BrowseContentCard,
      ContentCard,
      SmartLink
    },
    mixins: [
      collectionLinkGenMixin
    ],
    props: {
      section: {
        type: Object,
        default: () => (null)
      }
    },
    computed: {
      cards() {
        return this.section.hasPartCollection.items.filter(card => !!card);
      },

      isPeopleSection() {
        if (this.cards.length !== 4) {
          return false;
        }
        return this.cards.every((card) => {
          if (card['__typename'] !== 'AutomatedEntityCard') {
            return false;
          }
          const identifier = card.identifier;
          return identifier ? entityParamsFromUri(identifier).type === 'person' : false;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .browse-section {
    .col-lg-6 {
      @media (min-width: $bp-wqhd) {
        max-width: $max-text-column-width;
      }
    }

    h2,
    p {
      color: $mediumgrey;
      text-align: left;
    }

    h2 {
      font-weight: 600;
      font-size: $font-size-medium;

      @media (min-width: $bp-small) {
        font-size: $font-size-large;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-large-4k;
      }
    }

    p {
      line-height: 1.5;
    }
  }
</style>
