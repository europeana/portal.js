<template>
  <div class="contentful">
    <b-form-group>
      <b-button
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
  import contentfulSidebarMixin from '@/mixins/contentful/sidebar';
  import { langMapValueForLocale } from '@europeana/i18n/src/langMap.js';
  import { recordIdFromUrl } from '@europeana/apis/src/apis/record/index.js';
  import { BASE_URL } from '@europeana/apis/src/apis/data.js';

  export default {
    name: 'ContentfulImageHarvesterPage',

    mixins: [
      contentfulSidebarMixin
    ],

    layout: 'contentful',

    head() {
      return {
        title: 'Image harvester - Contentful app',
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    },

    methods: {
      async harvestImage() {
        const itemUrl = await this.getUrlFromUser();
        if (!itemUrl) {
          return;
        }

        let id = recordIdFromUrl(itemUrl);
        if (!id) {
          this.showError(`Unable to parse URL: ${itemUrl} Please make sure the URL conforms to the accepted formats.`);
          return;
        }

        let itemResponse;
        try {
          itemResponse = await this.$apis.record.axios.get(`${id}.json`);
        } catch (error) {
          this.showError(`Unable to harvest "${itemUrl}". Please make sure the item can be accessed on the Record API.`);
          return;
        }

        try {
          await this.populateFields(itemResponse.data.object);
          this.message = 'Success';
        } catch (error) {
          this.showError('There was a problem updating the entry.');
        }
      },

      async getUrlFromUser() {
        return this.contentfulExtensionSdk.dialogs.openPrompt({
          title: 'Harvest',
          message: 'Enter an item page URL, or an item URI or ID.',
          intent: 'positive'
        });
      },

      localiseValue(value) {
        return langMapValueForLocale(value, this.$i18n.locale).values[0] || null;
      },

      async populateFields(item) {
        const locale = this.$i18n.localeProperties.iso;

        const providerAggregation = item.aggregations.find(aggregation => aggregation.about.startsWith('/aggregation/provider/'));
        const providerProxy = item.proxies.find(proxy => proxy.about.startsWith('/proxy/provider/'));
        const edmIsShownBy = providerAggregation.edmIsShownBy;
        const edmIsShownByWebResource = (providerAggregation.webResources || []).find(webResource => webResource.about === edmIsShownBy);
        const edmDataProvider = providerAggregation.edmDataProvider;
        const edmDataProviderOrganization = item.organizations?.find(organization => organization.about === edmDataProvider.def?.[0]);

        if (!edmIsShownBy || !edmIsShownByWebResource?.ebucoreHasMimeType?.startsWith('image/')) {
          throw new Error('No edm:isShownBy image found.');
        }

        const name = this.localiseValue(providerProxy.dcTitle);

        const dcCreator = edmIsShownByWebResource?.dcCreator || providerProxy.dcCreator;
        const dcCreatorAgent = dcCreator ? item.agents?.find(agent => agent.about === dcCreator.def?.[0]) : undefined;
        const creator = this.localiseValue(dcCreatorAgent?.prefLabel || dcCreator);

        const provider = this.localiseValue(edmDataProviderOrganization?.prefLabel || edmDataProvider);

        const license = edmIsShownByWebResource?.webResourceEdmRights?.def?.[0] || providerAggregation.edmRights.def?.[0];

        const url = `${BASE_URL}/item${item.about}`;

        this.entry.fields.name?.setValue(name, locale);
        this.entry.fields.creator?.setValue(creator, locale);
        this.entry.fields.provider?.setValue(provider, locale);
        this.entry.fields.license?.setValue(license);
        this.entry.fields.url?.setValue(url);

        await this.entry.fields.image.removeValue();
        const asset = {
          fields: {
            title: {},
            file: {}
          }
        };

        asset.fields.title[locale] = name || item.about;
        asset.fields.file[locale] = {
          contentType: edmIsShownByWebResource.ebucoreHasMimeType,
          fileName: asset.fields.title[locale],
          upload: edmIsShownBy
        };

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
