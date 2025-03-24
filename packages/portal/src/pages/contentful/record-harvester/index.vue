<template>
  <div class="contentful">
    <b-form-group>
      <div class="thumbnail-preview">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          alt=""
        >
      </div>
      <b-form-input
        v-model="identifier"
        type="text"
      />
      <p>
        <b-button
          :disabled="!identifier"
          class="mb-2"
          @click="harvestRecord"
        >
          Go!
        </b-button>
        <b-button
          class="mb-2"
          @click="resetRecord"
        >
          Clear all data
        </b-button>
      </p>
    </b-form-group>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';
  import { recordIdFromUrl } from '@/plugins/europeana/record';

  export default {
    name: 'ContentfulRecordHarvesterPage',

    layout: 'contentful',

    data() {
      return {
        contentfulExtensionSdk: null,
        encoding: null,
        identifier: '',
        message: ''
      };
    },

    head() {
      return {
        title: 'Record harvester - Contentful app',
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    },

    computed: {
      thumbnailUrl() {
        if (this.encoding?.edmPreview) {
          return this.encoding?.edmPreview[0] + 'size=w200';
        }
        return undefined;
      }
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          sdk.window.startAutoResizer();

          this.identifier = sdk.field.getValue();
          this.encoding = sdk.entry.fields.encoding?.getValue();
        }
      });
    },

    methods: {
      async harvestRecord() {
        const itemIdentifier = recordIdFromUrl(this.identifier);
        if (!itemIdentifier) {
          this.message = `Unable to parse URL: ${this.identifier} Please make sure the URL conforms to the accepted formats.`;
          return;
        }

        const recordSearchParams = {
          profile: 'minimal',
          query: `europeana_id:"${itemIdentifier}"`,
          qf: ['contentTier:*'],
          rows: 1
        };

        let itemResponse;
        try {
          itemResponse = await this.$apis.record.search(recordSearchParams);
          if (!itemResponse.items[0]) {
            throw new Error('Not found');
          }
        } catch (error) {
          this.message = `Unable to harvest "${itemIdentifier}". Please make sure the item can be accessed on the Record API. Error: "${error.message}"`;
          return;
        }

        this.identifier = itemResponse.items[0].id;
        this.encoding = itemResponse.items[0];
        try {
          await this.populateFields();
          this.message = 'Success';
        } catch (error) {
          this.message = `There was a problem updating the entry. ${error.message}`;
        }
      },

      generateName() {
        return (langMapValueForLocale(this.encoding?.dcTitleLangAware, 'en').values[0] || `Record ${this.identifier}`).substring(0, 255);
      },

      async populateFields() {
        const name = this.generateName();

        this.contentfulExtensionSdk.field.setValue(this.encoding.id);
        this.contentfulExtensionSdk.entry.fields.name?.setValue(name, 'en-GB');
        this.contentfulExtensionSdk.entry.fields.encoding?.setValue(this.encoding);
      },

      resetRecord() {
        try {
          Object.values(this.contentfulExtensionSdk.entry.fields).forEach((field) => {
            field.removeValue();
          });
        } catch (error) {
          this.message = `There was a problem clearing the entry. ${error.message}`;
          return;
        }
        this.identifier = null;
        this.encoding = null;
        this.message = 'Successfully cleared all data';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    button {
      margin-right: 0.5rem;
    }

    .thumbnail-preview {
      float: right;
      max-height: 200px;
      max-width: 35%;
      height: 200px;
      width: 100%;
      background: #ddd;
      text-align: center;

      img {
        margin: auto;
        width: auto;
        height: 100%;
        max-height: 200px;
      }
    }

    input {
      width: 60%;
    }

    p {
      margin-top: 0.5rem;
    }

    font-size: 11px;
  }
</style>
