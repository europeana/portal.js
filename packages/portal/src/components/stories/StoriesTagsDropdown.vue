<template>
  <b-dropdown
    block
    no-flip
  >
    <RelatedCategoryTags
      v-if="($features.storiesPageAllTags || selectedTags.length > 0) && (displayTags.length > 0)"
      :tags="displayTags"
      :selected="selectedTags"
      :heading="false"
      class="responsive-font mb-2"
    />
  </b-dropdown>
</template>

<script>
  import RelatedCategoryTags from '@/components/related/RelatedCategoryTags';

  export default {
    name: 'StoriesTagsDropdown',

    components: {
      RelatedCategoryTags
    },

    props: {
      filteredTags: {
        type: Array,
        default: null
      },
      selectedTags: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        tags: []
      };
    },

    async fetch() {
      const categoriesVariables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };
      const categoriesResponse = await this.$contentful.query('categories', categoriesVariables);
      this.tags = (categoriesResponse.data.data.categoryCollection.items || [])
        .sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
    },

    computed: {
      displayTags() {
        if (this.filteredTags) {
          return this.tags.filter((tag) => this.filteredTags.includes(tag.identifier) || this.selectedTags.includes(tag.identifier));
        } else {
          return this.tags;
        }
      }
    }
  };
</script>
