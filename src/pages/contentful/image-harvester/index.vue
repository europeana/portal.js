<template>
  <div class="contentful">
    <b-form-group>
      <b-button
        id="entityHarvest"
        class="mb-2"
        @click="harvestImage"
      >
        Harvest
      </b-button>
    </b-form-group>
    <p>{{ message }}</p>
  </div>
</template>

<script>
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
      async harvestImage() {
        const itemUrl = await this.getUrlFromUser();
        if (!itemUrl) {
          return;
        }

        let id;
        try {
          (id = this.itemIdFromUrl(itemUrl));
        } catch (error) {
          this.showError(`Unable to parse URL: ${itemUrl} Please make sure the URL conforms to the accepted formats.`);
          return;
        }

        let itemResponse;
        try {
          itemResponse = await this.$apis.record.$axios.get(`${id}.json`);
        } catch (error) {
          this.showError(`Unable to harvest: ${itemUrl} Please make sure the item can be accessed on the Record API. ${error.message}`);
          return;
        }

        try {
          this.populateFields(itemResponse.data.object);
          this.message = 'Success';
        } catch (error) {
          this.showError(`There was a problem updating the entry. ${error.message}`);
        }
      },

      async getUrlFromUser() {
        return this.contentfulExtensionSdk.dialogs.openPrompt({
          title: 'Harvest',
          message: 'Enter an item page URL, or an item URI or ID.',
          intent: 'positive'
        });
      },

      // Supports:
      // - ID: /90402/SK_A_2344
      // - URI: http://data.europeana.eu/item/90402/SK_A_2344
      // - Website URL: http(s)://www.europeana.eu/($LOCALE/)item/90402/SK_A_2344
      itemIdFromUrl(url) {
        const urlMatch = url.match(/(\/[0-9]+\/[a-zA-Z0-9_]+)($|\?)/);
        if (!urlMatch) {
          throw new Error;
        }
        return urlMatch[1];
      },

      showError(error) {
        this.contentfulExtensionSdk.dialogs.openAlert({
          title: 'Error',
          message: error
        });
        this.message = 'Failed';
      },

      localiseValue(value) {
        return langMapValueForLocale(value, this.$i18n.locale).values[0] || null;
      },

      async populateFields(item) {
        const locale = this.$i18n.isoLocale();

        const providerAggregation = item.aggregations.find(aggregation => aggregation.about.startsWith('/aggregation/provider/'));
        const providerProxy = item.proxies.find(proxy => proxy.about.startsWith('/proxy/provider/'));
        const edmIsShownBy = providerAggregation.edmIsShownBy;
        const edmIsShownByWebResource = providerAggregation.webResources.find(webResource => webResource.about === edmIsShownBy);
        const edmDataProvider = providerAggregation.edmDataProvider;
        const edmDataProviderOrganization = item.organizations.find(organization => organization.about === edmDataProvider.def[0]);

        if (!edmIsShownBy || !/^image/.test(edmIsShownByWebResource.ebucoreHasMimeType)) {
          throw new Error('No edm:isShownBy image found.');
        }

        this.entry.fields.name?.setValue(this.localiseValue(providerProxy.dcTitle), locale);
        this.entry.fields.creator?.setValue(this.localiseValue(
          edmIsShownByWebResource.dcCreator || providerProxy.dcCreator
        ), locale);
        this.entry.fields.provider?.setValue(this.localiseValue(
          edmDataProviderOrganization?.prefLabel || edmDataProvider
        ), locale);
        this.entry.fields.license?.setValue(edmIsShownByWebResource?.webResourceEdmRights?.def?.[0] || providerAggregation.edmRights.def[0]);
        this.entry.fields.url?.setValue(`${BASE_URL}${item.about}`); // data.europeana.eu URI


        // create an asset
        const asset = {
          fields: {
            title: {},
            file: {}
          }
        };

        asset.fields.title[locale] = this.localiseValue(providerProxy.dcTitle) || item.about;
        asset.fields.file[locale] = {
          contentType: edmIsShownByWebResource.ebucoreHasMimeType,
          fileName: asset.fields.title[locale],
          upload: edmIsShownBy
        }

        const rawAsset = await this.contentfulExtensionSdk.space.createAsset(asset);
        await this.contentfulExtensionSdk.space.processAsset(rawAsset, locale);

        const processedAsset = await this.contentfulExtensionSdk.space.waitUntilAssetProcessed(
          rawAsset.sys.id,
          locale
        );

        const publishedAsset = await this.contentfulExtensionSdk.space.publishAsset(processedAsset);
        await this.entry.fields.image.setValue({
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: publishedAsset.sys.id
          }
        });
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle('Image harvester - Contentful app'),
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
