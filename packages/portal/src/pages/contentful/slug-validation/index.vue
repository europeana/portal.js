<template>
  <div class="contentful">
    <b-form>
      <b-form-group>
        <b-form-input
          v-model="value"
          autocomplete="off"
          :class="errorMessage ? 'error' : ''"
          @input="handleSlugChange"
        />
        <label
          v-if="errorMessage"
          class="error-message"
          v-text="errorMessage"
        />
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'ContentfulSlugValidationPage',

    layout: 'contentful',

    data() {
      return {
        value: null,
        contentTypes: [],
        slugField: null,
        titleField: null,
        siteField: null,
        slugFromTitle: false,
        errorMessage: null,
        debouncedDuplicateStatus: null,
        contentfulExtensionSdk: null
      };
    },

    head() {
      return {
        title: 'Slug validation - Contentful app',
        script: [
          { src: 'https://cdn.jsdelivr.net/npm/speakingurl@13.0.0/speakingurl.min.js' }
        ]
      };
    },

    watch: {
      value: 'updateContentfulField',
      debouncedDuplicateStatus: 'handleStatus'
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          sdk.window.startAutoResizer();

          this.contentTypes = [].concat(
            sdk.contentType.sys.id,
            sdk.parameters.instance.contentTypes?.split(',')
          ).filter(Boolean);

          this.value = sdk.field.getValue();
          this.slugField = sdk.field;
          const titleFieldName = sdk.contentType.displayField;
          this.titleField = sdk.entry.fields[titleFieldName];
          this.titleField.onValueChanged(this.handleTitleChange);
          this.siteField = sdk.entry.fields.site;
          if (this.siteField) {
            this.siteField.onValueChanged(this.handleSiteChange);
          }
          const titleValue = this.titleField.getValue();
          if (!this.value || this.value === 'undefined' || this.value === '') {
            // No slug exists, use the title as a default
            this.slugFromTitle = true;
            this.handleTitleChange(titleValue);
          } else if (this.value === this.convertToSlug(titleValue)) {
            // slug is the same as title, enable automatic update when the title changes.
            this.slugFromTitle = true;
          }
        }
      });
    },

    methods: {
      updateContentfulField() {
        this.contentfulExtensionSdk?.field?.setValue(this.value);
      },

      // Convert using the speakingurl package, which is included in the contentful layout.
      convertToSlug(text) {
        return window.getSlug(text);
      },

      /**
       * Handle change of slug value caused by either changing slug field
       * or changing the title of the entry
       */
      handleValueChange(value) {
        this.value = value;
        this.getDebouncedDuplicateStatus(value);
      },

      /**
       * Handle change of slug value caused by changing the slug of the entry.
       * This will disable updates of the slug from the title for the  current form.
       */
      handleSlugChange(value) {
        this.slugFromTitle = false;
        this.handleValueChange(value);
      },

      /**
       * Handle change of title value caused by changing the title of the entry.
       * If the slug was changed independently, don't update based of title changes.
       */
      handleTitleChange(value) {
        if (this.slugFromTitle) {
          this.handleValueChange(this.convertToSlug(value || ''));
        }
      },

      /**
       * Handle change of site value caused by changing the site of the entry.
       */
      handleSiteChange() {
        this.getDebouncedDuplicateStatus(this.value);
      },

      /**
       * Handle validation status, setting the field to valid/invalid and
       * removing the value in order to prevent publication if the slug is a duplicate.
       */
      async handleStatus() {
        const status = await this.debouncedDuplicateStatus;
        if (status) {
          this.slugField.removeValue();
          this.slugField.setInvalid(true);
          this.errorMessage = 'This slug has already been published in another entry';
        } else {
          // set value in case it had been reset. Otherwise required state might persist.
          this.slugField.setValue(this.value);
          this.slugField.setInvalid(false);
          this.errorMessage = null;
        }
      },

      // To prevent multiple API calls, or validation from a previous slug when typing fast.
      getDebouncedDuplicateStatus(slug) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.debouncedDuplicateStatus = this.getDuplicates(slug);
        }, 500);
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

        for (const contentType of this.contentTypes) {
          const contentTypeQuery = { ...query };
          contentTypeQuery['content_type'] = contentType;
          if (this.siteField) {
            contentTypeQuery['fields.' + this.siteField.id] = this.contentfulExtensionSdk.entry.fields.site?.getValue();
          }
          const result = await this.contentfulExtensionSdk.space.getEntries(contentTypeQuery);

          if (result.total >= 1) {
            return true;
          }
        }

        return false;
      }
    }
  };
</script>

<style lang="scss" scoped>
.contentful {
  /* stylelint-disable */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  /* stylelint-enable */
  font-size: 0.875rem;

  .form-control {
    font-size: 0.875rem;
    border-radius: 0;
    outline: none;
    background-color: #fff;
    border: 1px solid #d3dce0;
    max-height: 2.5rem;
    color: #536171;
    padding: 0.6563rem;
    padding-left: 0.6563rem;
    margin: 0;
    width: 100%;
    appearance: textfield;

    &:focus {
      border: 1px solid #2e75d4;
      box-shadow: 0 0 7px #2e75d4;
    }

    &.error {
      border: 1px solid rgb(191 48 69);

      &:focus {
        box-shadow: 0 0 7px rgb(191 48 69);
      }
    }
  }

  .error-message {
    color: rgb(191 48 69);
    margin-top: 0.75em;
  }
}
</style>
