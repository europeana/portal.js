<template>
  <section
    v-if="section && section.fields"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-9">
      <h2
        data-qa="section headline"
      >
        {{ section.fields.headline }}
      </h2>
      <p>
        {{ section.fields.text }}
      </p>
    </div>
    <div class="col-12">
      <b-card-group
        class="card-deck-4-cols"
        deck
        data-qa="section group"
      >
        <template v-if="!isPeopleSection">
          <BrowseContentCard
            v-for="card in cards"
            :key="card.sys.id"
            :fields="card.fields"
            :card-type="card.sys.contentType ? card.sys.contentType.sys.id : ''"
          />
        </template>
        <template v-else>
          <ContentCard
            v-for="card in cards"
            :key="card.sys.id"
            :title="card.fields.name"
            :url="entityRouterLink(card.fields.identifier, card.fields.slug)"
            :image-url="card.fields.image"
            :image-optimisation-options="{ width: 510 }"
            variant="mini"
          />
        </template>
      </b-card-group>
      <SmartLink
        v-if="section.fields.moreButton"
        :destination="section.fields.moreButton.fields.url"
        class="btn btn-light"
        data-qa="section more button"
      >
        {{ section.fields.moreButton.fields.text }}
      </SmartLink>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { entityParamsFromUri, getEntityTypeHumanReadable } from '../../plugins/europeana/entity';
  import ContentCard from '../generic/ContentCard';
  import BrowseContentCard from './BrowseContentCard';
  import SmartLink from '../generic/SmartLink';

  export default {
    components: {
      BrowseContentCard,
      ContentCard,
      SmartLink
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),

      cards() {
        return this.section.fields.hasPart.filter(card => card.fields);
      },

      isPeopleSection() {
        if (this.cards.length !== 4) return false;
        return this.cards.every((card) => {
          const identifier = card.fields.identifier;
          return identifier ? entityParamsFromUri(identifier).type === 'person' : false;
        });
      }
    },
    methods: {
      entityRouterLink(uri, slug) {
        const uriMatch = uri.match(`^${this.apiConfig.data.origin}/([^/]+)(/base)?/(.+)$`);
        return {
          name: 'collections-type-all', params: { type: getEntityTypeHumanReadable(uriMatch[1]), pathMatch: slug ? slug : uriMatch[3] }
        };
      }
    }
  };
</script>

<style lang="scss" scoped>

@import './assets/scss/variables.scss';

.browse-section {
  h2,
  p {
    color: $mediumgrey;
    text-align: left;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
  }

  p {
    letter-spacing: 0.0975rem;
    line-height: 1.5;
  }
}

</style>
