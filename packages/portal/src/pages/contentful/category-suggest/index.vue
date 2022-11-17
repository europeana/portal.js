<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        v-for="val in value"
        :key="val.sys.id"
        class="mb-2"
        @click="removeSelection(val)"
      >
        {{ val.fields.name['en-GB'] }}
      </b-button>
    </b-form-group>

    <b-form>
      <b-form-group>
        <b-form-input
          v-model="searchText"
          type="search"
          autocomplete="off"
          placeholder="Search for categories"
          @input="suggestCategories"
        />
      </b-form-group>
      <b-form-group>
        <b-button
          v-for="suggestion in suggestions"
          :key="suggestion.sys.id"
          class="mb-2"
          :disabled="isSelected(suggestion)"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.fields.name['en-GB'] }}
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  // TODO: this largely duplicates entity-suggest; refactor for DRYness
  export default {
    name: 'ContentfulCategorySuggestPage',

    layout: 'contentful',

    data() {
      return {
        value: [],
        searchText: null,
        suggestions: [],
        contentfulExtensionSdk: null
      };
    },

    head() {
      return {
        title: 'Category suggest - Contentful app'
      };
    },

    watch: {
      value: 'updateContentfulField'
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          sdk.window.startAutoResizer();
          this.findCategories();
        }
      });
    },

    methods: {
      isSelected(suggestion) {
        return this.value.map(val => val.sys.id).includes(suggestion.sys.id);
      },

      async suggestCategories(text) {
        if (text.length < 2) {
          return;
        }
        const response = await this.contentfulExtensionSdk.space.getEntries({
          'content_type': 'category',
          'fields.name[match]': text
        });
        this.suggestions = response.items;
      },

      async findCategories() {
        const ids = (this.contentfulExtensionSdk.field.getValue() || []).map((link) => link.sys.id);
        if (ids.length > 0) {
          const response = await this.contentfulExtensionSdk.space.getEntries({
            'sys.id[in]': ids.join(',')
          });

          // preserve order of stored category IDs
          const value = [];
          for (const id of ids) {
            const category = response.items.find((item) => item.sys.id === id);
            if (category) {
              value.push(category);
            }
          }
          this.value = value;
        }
      },

      removeSelection(remove) {
        this.value = this.value.filter(val => val.sys.id !== remove.sys.id);
      },

      selectSuggestion(select) {
        this.value = this.value.concat(select);
      },

      updateContentfulField() {
        this.contentfulExtensionSdk.field.setValue(this.value.map(val => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: val.sys.id
          }
        })));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    button {
      margin-right: 1rem;
    }
  }
</style>
