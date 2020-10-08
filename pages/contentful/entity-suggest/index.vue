<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        v-for="val in value"
        :key="val.id"
        class="mb-2"
        @click="removeSelection(val)"
      >
        {{ val.prefLabel.en || val.hiddenLabel.en }}
      </b-button>
    </b-form-group>

    <b-form>
      <b-form-group>
        <b-form-input
          v-model="searchText"
          type="search"
          autocomplete="off"
          placeholder="Search for topics"
          @input="inputSearchText"
        />
      </b-form-group>
      <b-form-group>
        <b-button
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="mb-2"
          :disabled="isSelected(suggestion)"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.prefLabel.en || suggestion.hiddenLabel.en }}
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  import { getEntitySuggestions, findEntities } from '../../../plugins/europeana/entity';

  export default {
    layout: 'contentful',

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
      window.contentfulExtension.init(sdk => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          sdk.window.startAutoResizer();

          const ids = sdk.field.getValue() || [];
          if (ids.length > 0) {
            findEntities(ids)
              .then(entities => {
                this.value = entities;
              });
          }
        }
      });
    },

    methods: {
      isSelected(suggestion) {
        return this.value.map(val => val.id).includes(suggestion.id);
      },

      inputSearchText(val) {
        getEntitySuggestions(val, { type: 'concept' })
          .then(suggestions => {
            this.suggestions = suggestions;
          });
      },

      removeSelection(remove) {
        this.value = this.value.filter(val => val.id !== remove.id);
      },

      selectSuggestion(select) {
        this.value = this.value.concat(select);
      },

      updateContentfulField() {
        if (this.contentfulExtensionSdk) this.contentfulExtensionSdk.field.setValue(this.value.map(val => val.id));
      }
    },

    head() {
      return {
        title: 'Entity suggest - Contentful app'
      };
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
