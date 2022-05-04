<template>
  <ContentCardSection
    :section="contentCardSection"
  />
</template>

<script>
  import ContentCardSection from '../browse/ContentCardSection';

  export default {
    name: 'EntityRelatedEditorial',

    components: {
      ContentCardSection
    },

    props: {
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        related: []
      };
    },

    async fetch() {
      const variables = {
        entityUri: this.identifier,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        limit: 4
      }
      const response = await this.$contentful.query('entityRelatedContent', variables);
      const entries = response.data.data;

      this.related = entries.blogPostingCollection.items
        .concat(entries.exhibitionPageCollection.items)
        .sort((a, b) => (new Date(b.datePublished)).getTime() - (new Date(a.datePublished)).getTime())
        .slice(0, 4);
    },

    computed: {
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
        })
      },

      contentCardSection() {
        return {
          '__typename': 'CardGroup',
          hasPartCollection: {
            items: this.contentCardHasPartCollection
          },
          headline: 'Editorial content you may like'
        };
      }
    }
  };
</script>
