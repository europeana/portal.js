<template>
  <ContentfulSuggestField
    v-if="contentfulExtensionSdk"
    :suggester="suggestCategories"
    :resolver="findCategories"
    :labeller="labelCategory"
    :link="true"
    placeholder="Search for categories"
  />
</template>

<script>
  import ContentfulSuggestField from '@/components/contentful/ContentfulSuggestField';

  export default {
    name: 'ContentfulCategorySuggestPage',

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
        title: 'Category suggest - Contentful app'
      };
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
      });
    },

    methods: {
      labelCategory(category) {
        return category.fields.name['en-GB'];
      },

      async suggestCategories(text) {
        if (text.length < 2) {
          return;
        }
        const response = await this.contentfulExtensionSdk.space.getEntries({
          'content_type': 'category',
          'fields.name[match]': text
        });
        return response.items;
      },

      async findCategories(fieldValue) {
        const sysIds = fieldValue.map((val) => val.sys.id);

        const response = await this.contentfulExtensionSdk.space.getEntries({
          'sys.id[in]': sysIds.join(',')
        });

        // preserve order of stored category IDs
        const cats = [];
        for (const id of sysIds) {
          const category = response.items.find((item) => item.sys.id === id);
          if (category) {
            cats.push(category);
          }
        }
        return cats;
      }
    }
  };
</script>
