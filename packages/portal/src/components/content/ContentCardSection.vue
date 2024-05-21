<template>
  <section
    v-if="section"
    class="browse-section row"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-6">
      <component
        :is="titleTag"
        class="card-group-title"
        data-qa="section headline"
      >
        {{ section.headline }}
      </component>
      <p
        v-if="section.text"
        class="text"
      >
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
  import ContentCard from './ContentCard';
  import BrowseContentCard from '../browse/BrowseContentCard';
  import SmartLink from '../generic/SmartLink';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';

  import { entityParamsFromUri } from '@/utils/europeana/entity.js';

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
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      }
    },
    computed: {
      cards() {
        return this.section.hasPartCollection?.items.filter(card => !!card) || [];
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
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .browse-section {
    .col-lg-6 {
      @media (min-width: $bp-wqhd) {
        max-width: $max-text-column-width;
      }
    }

    .text {
      color: $mediumgrey;
      text-align: left;
      line-height: 1.5;
    }
  }
</style>
