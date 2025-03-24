import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/image-harvester/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const apiResponse = () => ({
  object: {
    about: '/2063612/NO_280_001',
    aggregations: [
      {
        about: '/aggregation/provider/2063612/NO_280_001',
        edmDataProvider: {
          def: ['http://data.europeana.eu/organization/1482250000004516081']
        },
        edmIsShownBy: 'https://www.dropbox.com/s/lh4ous7fk4u41lj/NO_Madonna_Munch.M.00841.jpg?raw=1',
        edmRights: {
          def: ['http://creativecommons.org/licenses/by-nc/4.0/']
        },
        webResources: [
          {
            about: 'https://www.dropbox.com/s/lh4ous7fk4u41lj/NO_Madonna_Munch.M.00841.jpg?raw=1',
            ebucoreHasMimeType: 'image/jpeg',
            webResourceEdmRights: {
              def: ['http://creativecommons.org/licenses/by-nc/4.0/']
            }
          }
        ]
      }
    ],
    proxies: [
      {
        about: '/proxy/provider/2063612/NO_280_001',
        dcCreator: {
          def: ['http://viaf.org/viaf/61624802']
        },
        dcTitle: {
          en: 'Madonna'
        }
      }
    ],
    agents: [
      {
        about: 'http://viaf.org/viaf/61624802',
        prefLabel: {
          en: 'Edvard Munch'
        }
      }
    ],
    organizations: [
      {
        about: 'http://data.europeana.eu/organization/1482250000004516081',
        prefLabel: {
          en: ['The National Museum of Art, Architecture and Design']
        }
      }
    ]
  }
});

const apiErrorResponse = {
  response: {
    data: {
      success: false,
      error: 'Invalid record identifier'
    },
    headers: {
      'content-type': 'application/json'
    }
  }
};

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $apis: {
      record: {
        axios: {
          get: sinon.stub()
        },
        mediaProxyUrl: (url) => `proxied ${url}`
      }
    }
  }
});

const imageWithAttributionFields = ['name', 'image', 'creator', 'provider', 'license', 'url'];

describe('pages/contentful/image-harvester/index', () => {
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ entryFields: imageWithAttributionFields });
  });

  describe('head', () => {
    describe('title', () => {
      it('is "Image harvester - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Image harvester - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('harvestImage', () => {
      describe('when the item can be retrieved', () => {
        it('calls populateFields for the item', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.axios.get.resolves({ data: apiResponse() });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          expect(wrapper.vm.populateFields.called).toBe(true);
          expect(wrapper.vm.message).toBe('Success');
        });
      });

      describe('when the item URL can not be parsed', () => {
        it('shows an error for the URL', async() => {
          const wrapper = factory();
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns('https://example.org/failure'));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          expect(wrapper.vm.showError.calledWith('Unable to parse URL: https://example.org/failure Please make sure the URL conforms to the accepted formats.')).toBe(true);
          expect(wrapper.vm.populateFields.called).toBe(false);
        });
      });

      describe('when the item can not be retrieved', () => {
        it('shows an error for the response', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.axios.get.rejects(apiErrorResponse);
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          expect(wrapper.vm.populateFields.called).toBe(false);
          expect(wrapper.vm.showError.calledWith(`Unable to harvest "${apiResponse().object.about}". Please make sure the item can be accessed on the Record API.`)).toBe(true);
        });
      });

      describe('when the entry fields can not be set', () => {
        it('shows an error', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.axios.get.resolves({ data: apiResponse() });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          sinon.replace(wrapper.vm, 'populateFields', () => {
            throw Error('Contentful error');
          });
          wrapper.vm.showError = sinon.spy();

          await wrapper.vm.harvestImage();
          expect(wrapper.vm.showError.calledWith('There was a problem updating the entry.')).toBe(true);
        });
      });
    });

    describe('getUrlFromUser', () => {
      it('uses the contentfulExtension to get a URL', async() => {
        const wrapper = factory();
        await wrapper.vm.getUrlFromUser();
        expect(wrapper.vm.contentfulExtensionSdk.dialogs.openPrompt.called).toBe(true);
      });
    });

    describe('populateFields', () => {
      it('throws an error if there is no edm:isShownBy', async() => {
        const wrapper = factory();
        const item = apiResponse().object;
        delete item.aggregations[0].edmIsShownBy;

        let error;
        try {
          await wrapper.vm.populateFields(item);
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('No edm:isShownBy image found.');
      });

      it('throws an error if edm:isShownBy is not an image', async() => {
        const wrapper = factory();
        const item = apiResponse().object;
        item.aggregations[0].webResources[0].ebucoreHasMimeType = 'text/plain';

        let error;
        try {
          await wrapper.vm.populateFields(item);
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('No edm:isShownBy image found.');
      });

      describe('name', () => {
        it('uses dc:title from the provider proxy', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(apiResponse().object);
          expect(wrapper.vm.entry.fields.name.setValue.calledWith('Madonna')).toBe(true);
        });
      });

      describe('creator', () => {
        it('favours dc:creator from the edm:isShownBy web resource', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].webResources[0].dcCreator = { en: ['isShownBy creator'] };
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.creator.setValue.calledWith('isShownBy creator')).toBe(true);
        });

        it('falls back to dc:creator from the provider proxy', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.proxies[0].dcCreator = { en: ['proxy creator'] };
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.creator.setValue.calledWith('proxy creator')).toBe(true);
        });

        it('uses prefLabel for a linked agent', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.creator.setValue.calledWith('Edvard Munch')).toBe(true);
        });
      });

      describe('provider', () => {
        it('uses edm:dataProvider from the provider aggregation', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].edmDataProvider = { def: ['aggregation data provider'] };
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.provider.setValue.calledWith('aggregation data provider')).toBe(true);
        });

        it('uses prefLabel for a linked organization', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.provider.setValue.calledWith('The National Museum of Art, Architecture and Design')).toBe(true);
        });
      });

      describe('license', () => {
        it('favours edm:rights from the edm:isShownBy web resource', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].webResources[0].webResourceEdmRights = { def: ['isShownBy rights'] };
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.license.setValue.calledWith('isShownBy rights')).toBe(true);
        });

        it('falls back to edm:rights from the provider aggregation', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].edmRights = { def: ['aggregation rights'] };
          delete item.aggregations[0].webResources[0].webResourceEdmRights;
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.license.setValue.calledWith('aggregation rights')).toBe(true);
        });
      });

      describe('url', () => {
        it('uses data.europeana.eu item URI', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.url.setValue.calledWith('http://data.europeana.eu/item/2063612/NO_280_001')).toBe(true);
        });
      });

      describe('image', () => {
        it('removes the existing image', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.image.removeValue.called).toBe(true);
        });

        it('creates an asset from edm:isShownBy (via media proxy), and metadata', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          expect(wrapper.vm.contentfulExtensionSdk.space.createAsset.calledWith({
            fields: {
              title: {
                'en-GB': 'Madonna'
              },
              file: {
                'en-GB': {
                  contentType: 'image/jpeg',
                  fileName: 'Madonna',
                  upload: 'proxied https://www.dropbox.com/s/lh4ous7fk4u41lj/NO_Madonna_Munch.M.00841.jpg?raw=1'
                }
              }
            }
          })).toBe(true);
        });

        it('processes and publishes the asset', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          expect(wrapper.vm.contentfulExtensionSdk.space.processAsset.called).toBe(true);
          expect(wrapper.vm.contentfulExtensionSdk.space.waitUntilAssetProcessed.called).toBe(true);
          expect(wrapper.vm.contentfulExtensionSdk.space.publishAsset.called).toBe(true);
        });

        it('assigns the published image to the entry', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          expect(wrapper.vm.entry.fields.image.setValue.calledWith({
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'abcdef'
            }
          })).toBe(true);
        });
      });
    });
  });
});
