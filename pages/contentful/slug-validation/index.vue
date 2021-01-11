<template>
  <div class="contentful">
    <b-form>
      <b-form-group>
        <b-form-input
          v-model="value"
          autocomplete="off"
          @input="handleSlugChange"
        />
        <label
          v-text="errorMessage"
          />
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  export default {
    layout: 'contentful',

    data() {
      return {
        value: null,
        slugField: null,
        titleField: null,
        slugFromTitle: false,
        errorMessage: null,
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

          this.value = sdk.field.getValue();
          // this.slugText = this.value;
          this.slugField = sdk.field;
          const titleFieldName = sdk.contentType.displayField;
          this.titleField = sdk.entry.fields[titleFieldName];
          this.titleField.onValueChanged(this.handleTitleChange);
          if (this.value === this.convertToSlug(this.titleField.getValue())) {
            this.slugFromTitle = true;
          }
        }
      });
    },

    methods: {
      inputSlugText(val) {
        this.slugFromTitle = false;
        this.value = val;
      },

      updateContentfulField() {
        if (this.contentfulExtensionSdk) this.contentfulExtensionSdk.field.setValue(this.value);
      },

      convertToSlug(text) {
        return window.getSlug(text);
      },

      /**
       * Handle change of slug value caused by either changing slug field
       * or changing the title of the entry
       */
      handleSlugChange(value) {
        this.value = value;
        this.updateStatus(value);
      },

      /**
       * Handle change of title value caused by changing the title of the entry.
       * If the slug was changed independently, don't update based of title changes.
       */
      handleTitleChange(value) {
        if (this.slugFromTitle) this.handleSlugChange(this.convertToSlug(value || ''));
      },

      updateStatus(slug) {
        this.getDuplicates(slug).then((hasDuplicates) => {
          if (hasDuplicates) {
            this.slugField.setInvalid(true);
            this.contentfulExtensionSdk.entry.setInvalid(true);
            this.errorMessage = 'Error: slug already exists.';
          } else {
            this.slugField.setInvalid(false);
            this.errorMessage = null;
          }
        });
      },

      /**
       * Check if slug is already in use.
       * Resolves to 'true' if there are entries of the given content type that have
       * the same 'slug' value.
       */
      async getDuplicates(slug) {
        if (!slug) {
          return Promise.resolve(false);
        }

        const query = {};

        query['fields.' + this.slugField.id] = slug;
        query['sys.id[ne]'] = this.contentfulExtensionSdk.entry.getSys().id;
        query['sys.publishedAt[exists]'] = true;

        query['content_type'] = 'staticPage';
        const hasStaticPageMatch = this.contentfulExtensionSdk.space.getEntries(query).then((result) => {
          return result.total >= 1;
        });

        query['content_type'] = 'browsePage';
        const hasBrowsePageMatch = this.contentfulExtensionSdk.space.getEntries(query).then((result) => {
          return result.total >= 1;
        });

        return hasBrowsePageMatch || hasStaticPageMatch;
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle('Entity suggest - Contentful app')
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
