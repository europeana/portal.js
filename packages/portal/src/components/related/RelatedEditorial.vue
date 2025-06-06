<template>
  <section
    v-if="cardWrapper"
    v-show="related.length > 0"
    class="row mb-5"
  >
    <div class="col-12">
      <b-card
        class="related-editorial-card"
        :title="$t('related.editorial.title')"
        title-tag="h2"
      >
        <b-card-group
          class="d-flex flex-wrap"
        >
          <ContentCard
            v-for="(entry, index) in related"
            :key="index"
            :title="entry.name"
            :url="contentfulEntryUrl(entry)"
            :image-url="entry.primaryImageOfPage ? entry.primaryImageOfPage.image.url : null"
            :image-content-type="entry.primaryImageOfPage ? entry.primaryImageOfPage.image.contentType : null"
            :media-type="entry.primaryImageOfPage ? null : 'image'"
            variant="list"
          />
        </b-card-group>
      </b-card>
    </div>
  </section>
  <section
    v-else
    v-show="related.length > 0"
  >
    <h2
      class="card-group-title"
    >
      {{ $t('related.editorial.title') }}
    </h2>
    <b-card-group
      class="card-deck-4-cols"
      deck
    >
      <ContentCard
        v-for="(entry, index) in related"
        :key="index"
        :title="entry.name"
        :url="contentfulEntryUrl(entry)"
        :image-url="entry.primaryImageOfPage ? entry.primaryImageOfPage.image.url : null"
        :image-content-type="entry.primaryImageOfPage ? entry.primaryImageOfPage.image.contentType : null"
        :media-type="entry.primaryImageOfPage ? null : 'image'"
      />
    </b-card-group>
  </section>
</template>

<script>
  import ContentCard from '../content/ContentCard';
  import { contentfulEntryUrl } from '@/utils/contentful/entry-url.js';

  export default {
    name: 'RelatedEditorial',

    components: {
      ContentCard
    },

    props: {
      /**
       * URI of the entity
      */
      entityUri: {
        type: String,
        default: null
      },
      /**
       * related editorial entities
      */
      relatedEditorial: {
        type: Array,
        default: () => []
      },
      /**
       * search query
      */
      query: {
        type: String,
        // Default to an empty string (rather than `null`), to ensure that only
        // localised related editorial is returned.
        default: ''
      },
      cardWrapper: {
        type: Boolean,
        default: true
      },
      limit: {
        type: Number,
        default: 4
      },
      theme: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        related: this.relatedEditorial
      };
    },

    async fetch() {
      if (!this.entityUri && !this.theme && !this.query) {
        this.$emit('fetched');
        return;
      }

      const variables = {
        entityUri: this.entityUri,
        theme: this.theme,
        query: this.query,
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview',
        limit: this.limit
      };

      let graphql;
      if (this.entityUri) {
        graphql = await import('@/graphql/queries/entityRelatedContent.graphql');
      } else if (this.theme) {
        graphql = await import('@/graphql/queries/themeRelatedContent.graphql');
      } else {
        graphql = await import('@/graphql/queries/relatedContent.graphql');
      }
      const response = await this.$contentful.query(graphql, variables);
      const entries = response.data.data;

      this.related = entries.storyCollection.items
        .concat(entries.exhibitionPageCollection.items)
        .sort((a, b) => (new Date(b.datePublished)).getTime() - (new Date(a.datePublished)).getTime())
        .slice(0, this.limit);

      this.$emit('fetched');
    },

    watch: {
      query: '$fetch',
      entityUri: '$fetch'
    },

    methods: {
      contentfulEntryUrl
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .card.related-editorial-card {
    border: 0;
    box-shadow: $boxshadow-small;
    min-width: none;
    max-width: none;

    > .card-body {
      @media (min-width: $bp-4k) {
        padding: 1.875rem;
      }
    }

    h2 {
      font-size: $font-size-extrasmall;
      font-weight: 600;
      line-height: 1rem;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      color: $darkgrey;

      @media (min-width: $bp-4k) {
        font-size: $font-size-extrasmall-4k;
        line-height: 1.5rem;
        margin-bottom: 1.875rem;
      }
    }

    .card-group {
      column-gap: 1rem;

      .list-card {
        box-shadow: none;
        margin-bottom: 1.5rem;
        flex: 100%;
        border-radius: 0;
        min-width: none;
        max-width: none;

        @media (min-width: $bp-medium) {
          flex: calc(50% - 1rem);
          margin-bottom: 0.5rem;
          flex-grow: 0;
        }

        @media (min-width: $bp-wqhd) {
          flex-basis: calc(25% - 1rem);
        }

        @media (min-width: $bp-4k) {
          column-gap: 2rem;
          flex-basis: calc(25% - 2rem);
        }

        &:hover {
          background: $lightgrey;
        }

        .card-wrapper {
          flex-direction: row;

          @media (min-width: $bp-medium) {
            padding: 0.5rem;
          }

          &:hover {
            box-shadow: none;
          }
        }

        .card-img {
          width: 5.5rem;
          height: 5.5rem;
          flex: 0 0 5.5rem;
          min-height: 0;
          order: 2;
          margin: 0;
          margin-left: 1rem;

          @media (min-width: $bp-4k) {
            width: 8.25rem;
            height: 8.25rem;
            flex: 0 0 8.25rem;
          }

          img {
            object-fit: cover;
          }
        }

        .card-body {
          justify-content: space-between;
          order: 1;
          display: flex;
          flex-direction: column;
          padding: 0;
          flex: 100%;

          .title-texts-wrapper {
            order: 1;

            .card-title {
              line-height: 1.5;
              overflow: initial;
              display: inline;
              -webkit-line-clamp: none;
            }
          }

          .card-subtitle {
            font-size: $font-size-small;
            font-weight: normal;
            line-height: 1.5;
            order: 2;
            margin-bottom: 0;
            text-transform: none;

            @media (min-width: $bp-4k) {
              font-size: $font-size-small-4k;
            }
          }
        }
      }
    }
  }
</style>

<docs lang="md">
  Related editorial content: 4 entries
  ```jsx
  <RelatedEditorial
    entity-uri="http://data.europeana.eu/concept/190"
    :related-editorial="[{'__typename': 'Story',
      'name': 'Landscapes from the Soul: testing a longer title and even longer and some more characters',
      'identifier': 'landscapes-from-the-soul',
      'primaryImageOfPage': {
        'image': {
          'url': 'https://images.ctfassets.net/i01duvb6kq77/6WDayOZJdHkYiiNmQTjtXb/2c0e57e1d7fc2207ebe5c0cba2fc2a49/17.Hu_Chi-Chung_Sans_titre_1969__Huile_sur_sable_sur_toile__80_x_116_5cm.jpg',
          'contentType': 'image/jpeg'
        }
      }
    },
    {
      '__typename': 'Story',
      'name': 'Jesuits in China, Part 2',
      'identifier': 'jesuits-in-china-part-2',
      'primaryImageOfPage': {
        'image': {
          'url': 'https://images.ctfassets.net/i01duvb6kq77/6nhR29jb4UlVIfqX6beO6r/b934723593fe85f2c41864363a60a842/2024909_photography_ProvidedCHO_United_Archives_p_01753921_jpg.jpeg',
          'contentType': 'image/jpeg'
        }
      }
    },
    {
      '__typename': 'Story',
      'name': 'Wifredo Lam: disturbing the dreams of the exploiters',
      'identifier': 'wifredo-lam-disturbing-the-dreams-of-the-exploiters',
      'primaryImageOfPage': {
        'image': {
          'url': 'https://images.ctfassets.net/i01duvb6kq77/3SXe6aCZjJdYHQVj0vYwKM/e2642c8ceaa49bc10b12e31dbf6301ff/feature_wifredolam.jpg',
          'contentType': 'image/jpeg'
        }
      }
    },
    {
      '__typename': 'Story',
      'name': 'Vitalism: art celebrating sport, bodies & nature',
      'identifier': 'vitalism-art-celebrating-sport-bodies-and-nature',
      'primaryImageOfPage': {
        'image': {
          'url': 'https://images.ctfassets.net/i01duvb6kq77/16tOTH1YCcdO24iQJ4EYzK/e17a53c85ed0751533a9821933372954/feature_vitalism.jpg',
          'contentType': 'image/jpeg'
        }
      }
    }]"
  />
  ```
  Related editorial content: 1 entry
  ```jsx
  <RelatedEditorial
    entity-uri="http://data.europeana.eu/concept/190"
    :related-editorial="[{'__typename': 'Story',
      'name': 'Landscapes from the Soul: testing a longer title and even longer and some more characters',
      'identifier': 'landscapes-from-the-soul',
      'primaryImageOfPage': {
        'image': {
          'url': 'https://images.ctfassets.net/i01duvb6kq77/6WDayOZJdHkYiiNmQTjtXb/2c0e57e1d7fc2207ebe5c0cba2fc2a49/17.Hu_Chi-Chung_Sans_titre_1969__Huile_sur_sable_sur_toile__80_x_116_5cm.jpg',
          'contentType': 'image/jpeg'
        }
      }
    }]"
  />
</docs>
