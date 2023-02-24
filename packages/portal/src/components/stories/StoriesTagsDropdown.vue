<template>
  <div>
    <RelatedCategoryTags
      v-if="displaySelectedTags.length > 0"
      :tags="displaySelectedTags"
      :selected="selectedTags"
      :heading="false"
      class="responsive-font mb-2"
    />
    <div
      ref="tagsdropdown"
      class="position-relative mb-4"
    >
      <b-form
        class="search-form"
        inline
        @submit.stop.prevent="() => {}"
      >
        <b-form-input
          :id="'tag-search-input'"
          v-model="searchTag"
          type="search"
          :placeholder="$t('categories.search')"
          data-qa="tags dropdown search input"
          role="searchbox"
          aria-autocomplete="list"
          :aria-owns="showDropdown ? 'tags-options' : null"
          :aria-controls="showDropdown ? 'tags-options' : null"
          :aria-expanded="showDropdown"
          :aria-label="$t('categories.label')"
          @focus="showDropdown = true"
        />
      </b-form>
      <div
        v-if="showDropdown"
        id="tags-options"
        class="tag-search-dropdown"
        data-qa="tags search dropdown"
      >
        <RelatedCategoryTags
          v-if="displayTags.length > 0"
          :tags="displayTags"
          :selected="selectedTags"
          :heading="false"
          class="badge-container responsive-font mb-2"
        />
        <p v-else-if="displayTags.length === 0">
          {{ $t('categories.noOptions') }}
        </p>
      </div>
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
        default: () => []
      },
      selectedTags: {
        type: Array,
        default: () => []
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
        if (this.filteredTags.length) {
          // use filteredTags as those are sorted by most used
          displayTags = this.filteredTags.filter(tag => !this.selectedTags.includes(tag)).map(tag => this.tags.filter(t => t.identifier === tag)[0]);
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
      displaySelectedTags() {
        return this.tags.filter((tag) => this.selectedTags.includes(tag.identifier));
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
        if (((event.type === 'click' || event.key === 'Tab') && targetOutsideSearchDropdown) || event.key === 'Escape') {
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
  position: absolute;
  z-index: 20;
  box-shadow: $boxshadow;
  padding: 0.5rem 0 0 0.5rem;
  border-top: 1px solid $middlegrey;

  @media (min-width: $bp-xxxl) {
    font-size: 1vw;
  }
}

.badge-container {
  max-height: 15rem;
  overflow: auto;
  margin: 0;

  @media (min-width: $bp-medium) {
    max-height: 7.5rem;
  }

  @media (min-width: $bp-xxxl) {
    max-height: 7.5vw;
  }

  ::v-deep .col-12 {
    padding: 0;
  }
}

.form-inline {
  box-shadow: $boxshadow-light;
  border-radius: 0;
}
</style>
