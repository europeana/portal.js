<template>
  <div
    ref="tagsdropdown"
    class="position-relative"
  >
    <b-form
      @submit.stop.prevent="() => {}"
    >
      <b-form-input
        :id="'tag-search-input'"
        v-model="searchTag"
        type="search"
        :placeholder="$t('sideFilters.search')"
        data-qa="tags dropdown search input"
        role="searchbox"
        aria-autocomplete="list"
        :aria-owns="showDropdown ? 'tags-options' : null"
        :aria-controls="showDropdown ? 'tags-options' : null"
        :aria-expanded="showDropdown"
        :aria-label="$t('categories.search')"
        @focus="showDropdown = true"
      />
      <span class="icon-search" />
    </b-form>
    <div
      v-if="showDropdown"
      id="tags-options"
      class="tag-search-dropdown"
    >
      <RelatedCategoryTags
        v-if="displayTags.length > 0"
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
        showDropdown: false,
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
        const keyword = this.trimmedKeyword;
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
    },

    watch: {
      showDropdown(newVal) {
        if (newVal === true) {
          window.addEventListener('click', this.handleClickOrTabOutside);
          window.addEventListener('keydown', this.handleClickOrTabOutside);
        } else {
          window.removeEventListener('click', this.handleClickOrTabOutside);
          window.removeEventListener('keydown', this.handleClickOrTabOutside);
        }
      }
    },

    methods: {
      handleClickOrTabOutside(event) {
        const targetOutsideSearchDropdown = this.$refs.tagsdropdown && !this.$refs.tagsdropdown.contains(event.target);
        if ((event.type === 'click' || event.key === 'Tab' || event.key === 'Escape') && targetOutsideSearchDropdown) {
          this.showDropdown = false;
        }
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
