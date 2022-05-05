<template>
  <ContentCardSection
    :section="contentCardSection"
  />
</template>

<script>
  import ContentCardSection from '../browse/ContentCardSection';

  export default {
    name: 'RelatedEditorial',

    components: {
      ContentCardSection
    },

    props: {
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

    computed: {
      // Adapt response to format expected by ContentCardSection
      // TODO: refactor when design is implemented (EC-5798)
      contentCardHasPartCollection() {
        return this.related.map(entry => {
          let urlPrefix;
          if (entry['__typename'] === 'BlogPosting') {
            urlPrefix = '/blog';
          } else if (entry['__typename'] === 'exhibitionPage') {
            urlPrefix = '/exhibitions';
          }
          const url = `${urlPrefix}/${entry.identifier}`;

          return {
            '__typename': entry['__typename'],
            '__variant': 'mini',
            name: entry.name,
            image: entry.primaryImageOfPage.image,
            url
          };
        });
      },

      contentCardSection() {
        return {
          '__typename': 'CardGroup',
          hasPartCollection: {
            items: this.contentCardHasPartCollection
          },
          headline: this.$t('editorialContentYouMayLike')
        };
      }
    }
  };
</script>
