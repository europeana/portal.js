<template>
  <div>
    <b-badge
      v-for="(val, index) in value"
      :key="index"
      pill
      variant="primary"
    >
      {{ val }}
      <b-button
        aria-label="Remove"
        class="pill-close p-1"
        @click="removeSelection(val)"
      >
        x
        <span class="sr-only">
          Remove
        </span>
      </b-button>
    </b-badge>

    <b-form>
      <b-form-group>
        <b-form-input
          v-model="searchText"
          type="search"
          @input="inputSearch"
        />
      </b-form-group>
      <b-form-group>
        <b-form-radio
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          v-model="selected"
          :value="suggestion.id"
        >
          {{ suggestion.prefLabel.en || suggestion.hiddenLabel.en }}
        </b-form-radio>
      </b-form-group>
      <b-button
        v-if="suggestions.length > 0"
        :disabled="!selected"
        @click="selectSuggestion"
      >
        Select
      </b-button>
    </b-form>
  </div>
</template>

<script>
  import { getEntitySuggestions } from '../../plugins/europeana/entity';

  export default {
    layout: 'contentful',

    data() {
      return {
        value: [],
        searchText: null,
        suggestions: [],
        selected: null,
        contentfulExtensionSdk: null
      };
    },

    mounted() {
      window.contentfulExtension.init(sdk => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          this.value = sdk.field.getValue() || [];
        }
      });
    },

    methods: {
      inputSearch(val) {
        this.selected = null;
        getEntitySuggestions(val, { type: 'concept' })
          .then(suggestions => {
            this.suggestions = suggestions;
          });
      },

      selectSuggestion() {
        if (this.value.includes(this.selected)) return;
        this.value.push(this.selected);
        if (this.contentfulExtensionSdk) this.contentfulExtensionSdk.field.setValue(this.value);
      },

      removeSelection(remove) {
        this.value = this.value.filter(val => val !== remove);
        if (this.contentfulExtensionSdk) this.contentfulExtensionSdk.field.setValue(this.value);
      }
    },

    head() {
      return {
        title: 'Contentful app'
      };
    }
  };
</script>
