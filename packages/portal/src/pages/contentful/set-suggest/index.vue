<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        v-for="val in value"
        :key="val.id"
        class="mb-2"
        @click="removeSelection(val)"
      >
        {{ val.title.en || Object.values(val.title)[0] }}
      </b-button>
    </b-form-group>

    <b-form>
      <b-form-group>
        <b-form-input
          v-model="searchText"
          type="search"
          autocomplete="off"
          placeholder="Search for published user galleries"
          @input="suggestSets"
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
          {{ suggestion.title.en || Object.values(suggestion.title)[0] }}
        </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'ContentfulSetSuggestPage',

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
        title: 'Set suggest - Contentful app'
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
          this.findSets();
        }
      });
    },

    methods: {
      isSelected(suggestion) {
        return this.value.map(val => val.id).includes(suggestion.id);
      },

      async suggestSets(val) {
        const response = await this.$apis.set.search({
          query: val, qf: 'visibility:published', profile: 'standard'
        });
        this.suggestions = response.data.items || [];
      },

      findSets() {
        const ids = this.contentfulExtensionSdk.field.getValue() || [];
        if (ids.length > 0) {
          // TODO: this is very inefficient, requiring a GET request for each
          //       linked set, but the Set API does not yet support searching
          //       by multiple IDs combined with OR. refactor when the API
          //       supports searching by multiple IDs.
          Promise.all(ids.map((id) => this.$apis.set.get(id, { profile: 'standard' })))
            .then((sets) => {
              this.value = sets;
            });
        }
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
