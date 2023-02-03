<template>
  <ContentfulSuggestField
    v-if="contentfulExtensionSdk"
    :suggester="suggestThemePages"
    :resolver="findThemePages"
    :labeller="labelThemePage"
    :link="true"
    placeholder="Search for themes"
  />
</template>

<script>
  import ContentfulSuggestField from '@/components/contentful/ContentfulSuggestField';

  export default {
    name: 'ContentfulThemePageSuggestPage',

    components: {
      ContentfulSuggestField
    },

    layout: 'contentful',

    data() {
      return {
        contentfulExtensionSdk: null
      };
    },

    head() {
      return {
        title: 'Theme page suggest - Contentful app'
      };
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
      });
    },

    methods: {
      labelThemePage(themePage) {
        return themePage.fields.name['en-GB'];
      },

      async suggestThemePages(text) {
        if (text.length < 2) {
          return;
        }
        const response = await this.contentfulExtensionSdk.space.getEntries({
          'content_type': 'themePage',
          'fields.name[match]': text
        });
        return response.items;
      },

      async findThemePages(fieldValue) {
        const sysIds = fieldValue.map((val) => val.sys.id);

        const response = await this.contentfulExtensionSdk.space.getEntries({
          'sys.id[in]': sysIds.join(',')
        });

        // preserve order of stored theme page IDs
        const cats = [];
        for (const id of sysIds) {
          const themePage = response.items.find((item) => item.sys.id === id);
          if (themePage) {
            cats.push(themePage);
          }
        }
        return cats;
      }
    }
  };
</script>
