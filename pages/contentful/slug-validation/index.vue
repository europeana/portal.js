<template>
  <div class="contentful">
    <b-form>
      <b-form-group>
        <b-form-input
          v-model="value"
          autocomplete="off"
          @input="inputSlugText"
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
        // slugText: null,
        titleField: null,
        contentfulExtensionSdk: null,
        debouncedStatus: null
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
          this.titleField.onValueChanged(this.handleSlugChange);
        }
      });
    },

    computed: {
      status: {
        get() {
          return this.debouncedStatus;
        },
        set(val) {
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.debouncedStatus = val;
          }, 500);
        }
      }
    },

    methods: {
      inputSlugText(val) {
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
        this.setSlug(this.convertToSlug(value || ''));
      },

      /**
      * Set the input value to 'slug' and update the status by checking for
      * duplicates.
      */
      setSlug(slug) {
        this.value = slug;
        this.updateStatus(slug);
      },

      updateStatus(slug) {
        this.getDuplicates(slug).then((hasDuplicates) => {
          if (hasDuplicates) {
            // set to invalid state
            // show 'is invalid' text
          } else {
            // set field to valid
            // hide 'is invalid' text
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
