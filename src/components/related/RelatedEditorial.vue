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
      }
    },

    data() {
      return {
        related: []
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
  Related editorial content
  ```jsx
  <RelatedEditorial
    entity-uri="http://data.europeana.eu/concept/base/190"
  />
</docs>
