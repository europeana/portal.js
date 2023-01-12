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
      suggester: {
        type: Function,
        required: true
      },

      resolver: {
        type: Function,
        required: true
      },

      labeller: {
        type: Function,
        default: (val) => val
      },

      placeholder: {
        type: String,
        default: 'Search'
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
        const ids = this.contentfulExtensionSdk.field.getValue() || [];
        if (ids.length > 0) {
          this.value = await this.resolver(ids);
        }
      },

      async handleSearchInput(val) {
        this.suggestions = await this.suggester(val);
      },

      isSelected(suggestion) {
        return this.value.map(val => val.id).includes(suggestion.id);
      },

      removeSelection(remove) {
        this.value = this.value.filter(val => val.id !== remove.id);
      },

      selectSuggestion(select) {
        this.value = this.value.concat(select);
      },

      updateContentfulField() {
        this.contentfulExtensionSdk?.field?.setValue(this.value.map(val => val.id));
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
