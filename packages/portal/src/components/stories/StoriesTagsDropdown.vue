<template>
  <div
  class="position-relative">
    <b-form
      @submit.stop.prevent="() => {}"
    >
        <b-form-input
          :id="'tag-search-input'"
          ref="search-input"
          v-model="searchTag"
          type="text"
          autocomplete="off"
          :placeholder="$t('sideFilters.search')"
          data-qa="tags dropdown search input"
          @input="activeSearchInput = true"
          @focus="activeSearchInput = true"
          @blur="activeSearchInput = false"
        />
        <span class="icon-search" />
    </b-form>
    <div
      class="tag-search-dropdown"
    >
      <RelatedCategoryTags
        v-if="($features.storiesPageAllTags || selectedTags.length > 0) && (displayTags.length > 0)"
        :tags="displayTags"
        :selected="selectedTags"
        :heading="false"
        class="responsive-font mb-2"
      />
    </div>
  </div>
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
        activeSearchInput: false,
        searchTag: '',
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
        let displayTags;
        const keyword = this.trimmedKeyword
        if (this.filteredTags) {
          displayTags = this.tags.filter((tag) => this.filteredTags.includes(tag.identifier) || this.selectedTags.includes(tag.identifier));
        } else {
          displayTags = this.tags;
        }

        if (keyword) {
          displayTags = displayTags.filter(tag => {
            const tagLabel = tag.name;
            const tagNameMatch = tagLabel.toLowerCase().indexOf(keyword) > -1;
            return tagNameMatch;
          });
        }
         return displayTags;
      },
      trimmedKeyword() {
        return this.searchTag.trim().toLowerCase();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.tag-search-dropdown {
  width: 100%;
  background-color: $white;
  overflow: hidden;
  overflow-x: scroll;
  animation: appear 750ms ease-in-out;
  position: absolute;
  z-index: 20;
  box-shadow: $boxshadow;
  max-height: 50vh;

  @media (min-width: $bp-xxxl) {
    font-size: 1vw;
  }
}

@keyframes appear {
  from {
    max-height: 0;
  }

  to {
    max-height: 0vh;
  }
}
</style>
