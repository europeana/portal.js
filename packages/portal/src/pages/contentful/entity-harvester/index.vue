<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        class="mb-2"
        @click="harvestEntity"
      >
        Harvest
      </b-button>
    </b-form-group>
    <p>{{ message }}</p>
    <div class="cf-form-hint">
      Examples:
      <ul
        style="margin-top: 0;
          padding-left: 1.25rem;"
      >
        <li>http://data.europeana.eu/agent/59832</li>
        <li>https://api.europeana.eu/entity/timespan/20</li>
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
    entityParamsFromUri
  } from '@/plugins/europeana/entity';
  import contentfulSidebarMixin from '@/mixins/contentful/sidebar';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';
  import { langMapValueForLocale } from '@europeana/i18n/langMap.js';
  import { BASE_URL } from '@/plugins/europeana/data';

  export default {
    name: 'ContentfulEntityHarvesterPage',

    mixins: [
      contentfulSidebarMixin
    ],

    layout: 'contentful',

    data() {
      return {
        contentfulExtensionSdk: null,
        entry: null,
        message: null
      };
    },

    head() {
      return {
        title: 'Entity harvester - Contentful app',
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    },

    methods: {
      async harvestEntity() {
        const entityUrl = await this.getUrlFromUser();
        if (!entityUrl) {
          return;
        }

        let type, id;
        try {
          ({ type, id } = this.entityParamsFromUrl(entityUrl));
        } catch (error) {
          this.showError(`Unable to parse URL: ${entityUrl} Please make sure the URL conforms to the accepted formats.`);
          return;
        }

        let entityResponse;
        try {
          entityResponse = await this.$apis.entity.get(type, id);
        } catch (error) {
          this.showError(`Unable to harvest: ${entityUrl} Please make sure the entity can be accessed on the entity API.`);
          return;
        }

        try {
          this.populateFields(entityResponse.entity, id);
          this.message = 'Success';
        } catch (error) {
          this.showError(`There was a problem updating the entry. ${error.message}`);
        }
      },

      async getUrlFromUser() {
        return this.contentfulExtensionSdk.dialogs.openPrompt({
          title: 'Harvest',
          message: 'Enter a Europeana.eu entity/collection page URL, or an entity URI',
          intent: 'positive'
        });
      },

      entityParamsFromUrl(url) {
        url = url.replace(/^https?:\/\/api\.europeana\.eu\/entity/, BASE_URL);
        if (isEntityUri(url)) {
          return entityParamsFromUri(url);
        }
        const pageMatch = url.match(/^https?:\/\/[^/]+(\/[a-z]{2})?\/collections\/(person|topic|time)\/(\d+)/);
        if (pageMatch) {
          const type = pageMatch[2];
          const id = pageMatch[3];
          return { type, id };
        }
        throw new Error;
      },

      // TODO: set up a configurable map for other fields to avoid hard-coding them here
      populateFields(response, id) {
        const enPrefLabel = langMapValueForLocale(response.prefLabel, 'en', { omitAllUris: true }).values[0];
        // set field values
        this.entry.fields.identifier.setValue(response.id); // data.europeana.eu URI

        this.entry.fields.slug?.setValue(getLabelledSlug(id, enPrefLabel)); // slug

        this.entry.fields.type?.setValue(getEntityTypeHumanReadable(response.type)); // entity type

        // set name field from `prefLabel`
        this.entry.fields.name?.setValue(enPrefLabel);

        // set description from different fields based on entity type
        this.entry.fields.description?.setValue(this.entityDescriptionFromResponse(response));

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
        case 'Place':
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
        }

        return description;
      }
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
