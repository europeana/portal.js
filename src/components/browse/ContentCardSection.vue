<template>
  <section
    v-if="section"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-9">
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
        class="btn btn-light"
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

  import { entityParamsFromUri, getEntityTypeHumanReadable } from '@/plugins/europeana/entity';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  export default {
    components: {
      BrowseContentCard,
      ContentCard,
      SmartLink
    },
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
    },
    methods: {
      entityRouterLink(uri, slug) {
        const uriMatch = uri.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);
        return {
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: slug ? slug : uriMatch[3]
          }
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .browse-section {
    h2,
    p {
      color: $mediumgrey;
      text-align: left;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.1212rem;
    }

    p {
      letter-spacing: 0.0975rem;
      line-height: 1.5;
    }
  }
</style>
