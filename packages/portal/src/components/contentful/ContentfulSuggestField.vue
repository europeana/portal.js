<template>
  <div class="contentful">
    <b-form>
      <b-form-group
        data-qa="selected values"
      >
        <b-button
          v-for="(val, index) in value"
          :key="index"
          class="mb-2"
          @click="removeSelection(val)"
        >
          {{ labeller(val) }}
        </b-button>
      </b-form-group>
    </b-form>

    <b-form>
      <b-form-group>
        <b-form-input
          v-model="searchText"
          type="search"
          autocomplete="off"
          data-qa="search input"
          :placeholder="placeholder"
          @input="handleSearchInput"
        />
      </b-form-group>

      <b-form-group
        data-qa="suggestions"
      >
        <b-button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="mb-2"
          :disabled="isSelected(suggestion)"
          @click="selectSuggestion(suggestion)"
        >
          {{ labeller(suggestion) }}
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'ContentfulSuggestField',

    props: {
      /**
       * Called when text is input in order to get new suggestions
       */
      suggester: {
        type: Function,
        required: true
      },

      /**
       * Called on initialisation to resolve stored values (in Contentful) to
       * full objects that can be used for displayed, e.g. converting stored URIs
       * to richer item metadata with labels
       */
      resolver: {
        type: Function,
        required: true
      },

      /**
       * Called to convert an item (selected or suggested) to a displayable
       * text label.
       */
      labeller: {
        type: Function,
        default: (val) => val
      },

      /**
       * Placeholder text for the search input field
       */
      placeholder: {
        type: String,
        default: 'Search'
      },

      /**
       * If `true`, the values are treated as links to other Contentful entries
       */
      link: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        value: [],
        searchText: null,
        suggestions: [],
        contentfulExtensionSdk: null
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
          this.resolveFieldValue();
        }
      });
    },

    methods: {
      async resolveFieldValue() {
        const fieldValue = this.contentfulExtensionSdk.field.getValue() || [];
        if (fieldValue.length > 0) {
          this.value = await this.resolver(fieldValue);
        }
      },

      async handleSearchInput(val) {
        this.suggestions = await this.suggester(val);
      },

      identifier(val) {
        return this.link ? val.sys.id : val.id;
      },

      isSelected(suggestion) {
        return this.value.map(val => this.identifier(val)).includes(this.identifier(suggestion));
      },

      removeSelection(remove) {
        this.value = this.value.filter(val => this.identifier(val) !== this.identifier(remove));
      },

      selectSuggestion(select) {
        this.value = this.value.concat(select);
      },

      contentfulFieldValue(val) {
        return this.link ? this.contentfulFieldLink(val) : this.identifier(val);
      },

      contentfulFieldLink(val) {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: this.identifier(val)
          }
        };
      },

      updateContentfulField() {
        this.contentfulExtensionSdk?.field?.setValue(this.value.map(val => this.contentfulFieldValue(val)));
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
