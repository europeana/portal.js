<template>
  <section
    v-show="related.length > 0"
    class="row mb-5"
  >
    <div class="col-12">
      <b-card
        class="card-group-card"
        :title="$t('editorialContentYouMayLike')"
        title-tag="h2"
      >
        <b-card-group
          class="d-flex flex-wrap"
        >
          <ContentCard
            v-for="(entry, index) in related"
            :key="index"
            :title="entry.name"
            :url="entryUrl(entry)"
            :image-url="entry.primaryImageOfPage.image.url"
            :image-content-type="entry.primaryImageOfPage.image.contentType"
            variant="list"
          />
        </b-card-group>
      </b-card>
    </div>
  </section>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

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
      }
    },

    data() {
      return {
        related: this.relatedEditorial
      };
    },

    async fetch() {
      // TODO: in future, this component may instead make other queries, e.g
      //       to search editorial content by title
      if (!this.entityUri) {
        return;
      }

      const variables = {
        entityUri: this.entityUri,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        limit: 4
      };
      const response = await this.$contentful.query('entityRelatedContent', variables);
      const entries = response.data.data;

      this.related = entries.blogPostingCollection.items
        .concat(entries.exhibitionPageCollection.items)
        .sort((a, b) => (new Date(b.datePublished)).getTime() - (new Date(a.datePublished)).getTime())
        .slice(0, 4);
    },

    methods: {
      entryUrl(entry) {
        let urlPrefix;

        if (entry['__typename'] === 'BlogPosting') {
          urlPrefix = '/blog';
        } else if (entry['__typename'] === 'ExhibitionPage') {
          urlPrefix = '/exhibitions';
        }

        return `${urlPrefix}/${entry.identifier}`;
      }
    }
  };
</script>

<docs lang="md">
  Related editorial content: 4 entries
  ```jsx
  <RelatedEditorial
    entity-uri="http://data.europeana.eu/concept/base/190"
    :related-editorial="[{'__typename': 'BlogPosting',
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
      '__typename': 'BlogPosting',
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
      '__typename': 'BlogPosting',
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
      '__typename': 'BlogPosting',
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
    entity-uri="http://data.europeana.eu/concept/base/190"
    :related-editorial="[{'__typename': 'BlogPosting',
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
