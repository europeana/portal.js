<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        id="entityHarvest"
        class="mb-2"
        @click="harvestEntity"
      >
        Harvest
      </b-button>
    </b-form-group>
    <p>{{ message }}</p>
    <div class="cf-form-hint">
      Examples:
      <ul style="margin-top: 0; padding-left: 1.25rem;">
        <li>http://data.europeana.eu/agent/base/59832</li>
        <li>https://api.europeana.eu/entity/timespan/base/20</li>
        <li>https://www.europeana.eu/en/collections/person/60404-johannes-vermeer</li>
        <li>https://portaljs-test.eanadev.org/collections/topic/190</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {
    isEntityUri,
    getEntityTypeHumanReadable,
    getEntitySlug,
    entityParamsFromUri
  } from '@/plugins/europeana/entity';
  import { langMapValueForLocale } from '@/plugins/europeana/utils';
  import { BASE_URL } from '@/plugins/europeana/data';

  export default {
    layout: 'contentful',

    data() {
      return {
        contentfulExtensionSdk: null,
        entry: null,
        message: null
      };
    },

    watch: {
      value: 'updateContentfulFields'
    },

    mounted() {
      window.contentfulExtension.init(sdk => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_SIDEBAR)) {
          sdk.window.startAutoResizer();

          this.entry = sdk.entry;
        }
      });
    },

    methods: {
      async harvestEntity() {
        const entityUrl = await this.contentfulExtensionSdk.dialogs.openPrompt({
          title: 'Harvest',
          message: 'Enter a Europeana.eu entity/collection page URL, or an entity URI',
          intent: 'positive'
        });
        if (!entityUrl) {
          return;
        }

        let type, id;
        try {
          ({ type, id } = this.entityParamsFromUrl(entityUrl));
        } catch (error) {
          this.showError(`Unable to harvest from URL: ${entityUrl} Please make sure the URL conforms to the accepted formats.`);
          return;
        }

        const entityResponse = await this.$apis.entity.getEntity(type, id);

        if (entityResponse.entity) {
          this.populateFields(entityResponse.entity, id);
          this.message = 'Success';
        } else {
          this.showError(entityResponse.error);
        }
      },

      entityParamsFromUrl(url) {
        url = url.replace(new RegExp('^https?://api.europeana.eu/entity'), BASE_URL);
        if (isEntityUri(url)) {
          return entityParamsFromUri(url);
        }
        const pageMatch = url.match(new RegExp('^https?://[^/]+(/[a-z]{2})?/collections/(person|topic|time)/([0-9]+)+'));
        if (pageMatch) {
          const type = pageMatch[2];
          const id = pageMatch[3];
          return { type, id };
        }
        throw new Error;
      },

      showError(error) {
        this.contentfulExtensionSdk.dialogs.openAlert({
          title: 'Error',
          message: error
        });
        this.message = 'Failed';
      },

      // TODO: set up a configurable map for other fields to avoid hard-coding them here
      populateFields(response, id) {
        const enPrefLabel = langMapValueForLocale(response.prefLabel, 'en', { omitAllUris: true }).values[0];
        // set field values
        this.entry.fields.identifier.setValue(response.id); // data.europeana.eu URI

        if (this.entry.fields.slug) {
          this.entry.fields.slug.setValue(getEntitySlug(id, enPrefLabel)); // slug
        }

        if (this.entry.fields.type) {
          this.entry.fields.type.setValue(getEntityTypeHumanReadable(response.type)); // entity type
        }

        // set name field from `prefLabel`
        if (this.entry.fields.name) {
          this.entry.fields.name.removeValue();
          if (response.prefLabel) {
            this.entry.fields.name.setValue(enPrefLabel);
          }
        }

        // set description from different fields based on entity type
        if (this.entry.fields.description) {
          this.entry.fields.description.removeValue();
          this.entry.fields.description.setValue(this.entityDescriptionFromResponse(response));
        }

        // set image field from `isShownBy`
        if (this.entry.fields.image) {
          this.entry.fields.image.removeValue();
          if (response.isShownBy) {
            this.entry.fields.image.setValue(response.isShownBy.thumbnail);
          }
        }
      },

      entityDescriptionFromResponse(response) {
        let description = '';

        switch (response.type) {
        case 'Agent':
          // use `biographicalInformation`
          // NB: this is in JSON-LD expanded form
          description = langMapValueForLocale(response.biographicalInformation, 'en').values[0];
          break;
        case 'Concept':
          // use `note`
          // NB: language map with each value being an array of literals
          description = langMapValueForLocale(response.note, 'en').values[0];
          break;
        case 'Organization':
          // use `description`
          // NB: language map with each value being a single literal
          description = langMapValueForLocale(response.description, 'en').values[0];
          break;
        case 'Timespan':
          // TODO: use what? `${response.begin} to ${response.end}`?
          break;
        case 'Place':
          // TODO: use what? `${response.lat},${response.long}`?
          break;
        }

        return description;
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle('Entity harvester - Contentful app'),
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    button {
      margin-right: 1rem;
    }
    font-size: 11px;
  }
</style>
