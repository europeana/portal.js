<template>
  <div>
    <RelatedCategoryTags
      v-if="displaySelectedTags.length > 0"
      :tags="displaySelectedTags"
      :selected="selectedTags"
      :heading="false"
      class="mb-2"
    />
    <div
      ref="tagsdropdown"
      v-click-outside="clickOutsideConfig"
      class="position-relative mb-4"
      @focusin="handleFocusin"
      @keydown.esc="handleEsc"
    >
      <b-form
        class="search-form"
        :class="{ 'show': showDropdown }"
        inline
        @submit.stop.prevent="() => {}"
      >
        <b-form-input
          :id="'tag-search-input'"
          v-model="searchTag"
          autocomplete="off"
          type="search"
          :placeholder="$t('categories.search')"
          data-qa="tags dropdown search input"
          role="searchbox"
          aria-autocomplete="list"
          :aria-owns="showDropdown ? 'tags-options' : null"
          :aria-controls="showDropdown ? 'tags-options' : null"
          :aria-expanded="showDropdown"
          :aria-label="$t('categories.label')"
          @keydown.down="handleInputDown"
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
          ref="relatedCategoryTags"
          :tags="displayTags"
          :selected="selectedTags"
          :heading="false"
          tabindex="-1"
          class="badge-container mb-2"
        />
        <p v-else-if="displayTags.length === 0">
          {{ $t('categories.noOptions') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import vClickOutside from 'v-click-outside';

  import RelatedCategoryTags from '@/components/related/RelatedCategoryTags';

  export default {
    name: 'StoriesTagsDropdown',

    components: {
      RelatedCategoryTags
    },

    directives: {
      clickOutside: vClickOutside.directive
    },

    props: {
      filteredTags: {
        type: Array,
        default: null
      },
      selectedTags: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        // https://www.npmjs.com/package/v-click-outside
        clickOutsideConfig: {
          capture: true,
          events: ['click', 'dblclick', 'focusin', 'touchstart'],
          handler: this.handleClickOutside,
          isActive: false
        },
        showDropdown: false,
        searchTag: '',
        tags: []
      };
    },

    async fetch() {
      const categoriesVariables = {
        locale: this.$i18n.localeProperties.iso,
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
      '$route.query.tags'() {
        this.showDropdown = false;
      }
    },

    methods: {
      setClickOutsideConfigIsActive(isActive) {
        // need to do this instead of just setting isActive due to
        // https://github.com/ndelvalle/v-click-outside/issues/143
        this.clickOutsideConfig = {
          ...this.clickOutsideConfig,
          isActive
        };
      },
      handleFocusin() {
        this.setClickOutsideConfigIsActive(true);
        this.showDropdown = true;
      },
      handleClickOutside() {
        this.setClickOutsideConfigIsActive(false);
        this.showDropdown = false;
      },
      handleEsc() {
        this.handleClickOutside();
        console.log('hello');
        this.$emit('escapeDropdown');
        console.log('emmitted');
      },
      handleInputDown() {
        const firstTag = this.$refs.relatedCategoryTags?.$el.getElementsByTagName('a')?.[0];
        firstTag?.focus();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.tag-search-dropdown {
  width: 100%;
  background-color: $white;
  overflow: hidden;
  position: absolute;
  z-index: 20;
  box-shadow: $boxshadow;
  padding: 0.5rem 0 0 0.5rem;
  border: 1px solid $bodygrey;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  @media (min-width: $bp-4k) {
    font-size: 1.5rem;
  }
}

.badge-container {
  max-height: 15rem;
  overflow: auto;
  margin: 0;

  @media (min-width: $bp-4k) {
    max-height: calc(1.5 * 15rem);
  }

  ::v-deep .col-12 {
    padding: 0;
  }
}

.search-form.show {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

}
</style>
