import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/image-harvester/index';
import sinon from 'sinon';
import { apiError } from '@/plugins/europeana/utils';

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
    }
  }
};

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $pageHeadTitle: key => key,
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $apis: {
      record: {
        $axios: {
          get: sinon.stub()
        }
      }
    }
  }
});

const imageWithAttributionFields = ['name', 'image', 'creator', 'provider', 'license', 'url'];

describe('pages/contentful/image-harvester/index', () => {
  before('supply fake contentful extension', () => {
    window.contentfulExtension = fakeContentfulExtension(imageWithAttributionFields);
  });

  describe('methods', () => {
    describe('harvestImage', () => {
      context('when the item can be retrieved', () => {
        it('calls populateFields for the item', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.$axios.get.resolves({ data: apiResponse() });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.populateFields.should.have.been.called;
          wrapper.vm.message.should.eq('Success');
        });
      });

      context('when the item URL can not be parsed', () => {
        it('shows an error for the URL', async() => {
          const wrapper = factory();
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns('https://example.org/failure'));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.showError.should.have.been.calledWith('Unable to parse URL: https://example.org/failure Please make sure the URL conforms to the accepted formats.');
          wrapper.vm.populateFields.should.not.have.been.called;
        });
      });

      context('when the item can not be retrieved', () => {
        it('shows an error for the response', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.$axios.get.rejects(apiError(apiErrorResponse));
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.populateFields.should.not.have.been.called;
          wrapper.vm.showError.should.have.been.calledWith(`Unable to harvest "${apiResponse().object.about}". Please make sure the item can be accessed on the Record API. Error: "${apiErrorResponse.response.data.error}"`);
        });
      });

      context('when the entry fields can not be set', () => {
        it('shows an error', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.$axios.get.resolves({ data: apiResponse() });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse().object.about));
          sinon.replace(wrapper.vm, 'populateFields', () => {
            throw Error('Contentful error');
          });
          wrapper.vm.showError = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.showError.should.have.been.calledWith('There was a problem updating the entry. Contentful error');
        });
      });
    });

    describe('getUrlFromUser', () => {
      it('uses the contentfulExtension to get a URL', async() => {
        const wrapper = factory();
        await wrapper.vm.getUrlFromUser();
        wrapper.vm.contentfulExtensionSdk.dialogs.openPrompt.should.have.been.called;
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

        error.message.should.eq('No edm:isShownBy image found.');
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

        error.message.should.eq('No edm:isShownBy image found.');
      });

      describe('name', () => {
        it('uses dc:title from the provider proxy', () => {
          const wrapper = factory();
          wrapper.vm.populateFields(apiResponse().object);
          wrapper.vm.entry.fields.name.setValue.should.have.been.calledWith('Madonna');
        });
      });

      describe('creator', () => {
        it('favours dc:creator from the edm:isShownBy web resource', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].webResources[0].dcCreator = { en: ['isShownBy creator'] };
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.creator.setValue.should.have.been.calledWith('isShownBy creator');
        });

        it('falls back to dc:creator from the provider proxy', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.proxies[0].dcCreator = { en: ['proxy creator'] };
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.creator.setValue.should.have.been.calledWith('proxy creator');
        });

        it('uses prefLabel for a linked agent', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.creator.setValue.should.have.been.calledWith('Edvard Munch');
        });
      });

      describe('provider', () => {
        it('uses edm:dataProvider from the provider aggregation', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].edmDataProvider = { def: ['aggregation data provider'] };
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.provider.setValue.should.have.been.calledWith('aggregation data provider');
        });

        it('uses prefLabel for a linked organization', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.provider.setValue.should.have.been.calledWith('The National Museum of Art, Architecture and Design');
        });
      });

      describe('license', () => {
        it('favours edm:rights from the edm:isShownBy web resource', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].webResources[0].webResourceEdmRights = { def: ['isShownBy rights'] };
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.license.setValue.should.have.been.calledWith('isShownBy rights');
        });

        it('falls back to edm:rights from the provider aggregation', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          item.aggregations[0].edmRights = { def: ['aggregation rights'] };
          delete item.aggregations[0].webResources[0].webResourceEdmRights;
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.license.setValue.should.have.been.calledWith('aggregation rights');
        });
      });

      describe('url', () => {
        it('uses data.europeana.eu item URI', () => {
          const wrapper = factory();
          const item = apiResponse().object;
          wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.url.setValue.should.have.been.calledWith('http://data.europeana.eu/item/2063612/NO_280_001');
        });
      });

      describe('image', () => {
        it('creates an asset from edm:isShownBy and metadata', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          wrapper.vm.contentfulExtensionSdk.space.createAsset.should.have.been.calledWith({
            fields: {
              title: {
                'en-GB': 'Madonna'
              },
              file: {
                'en-GB': {
                  contentType: 'image/jpeg',
                  fileName: 'Madonna',
                  upload: 'https://www.dropbox.com/s/lh4ous7fk4u41lj/NO_Madonna_Munch.M.00841.jpg?raw=1'
                }
              }
            }
          });
        });

        it('processes and publishes the asset', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          wrapper.vm.contentfulExtensionSdk.space.processAsset.should.have.been.called;
          wrapper.vm.contentfulExtensionSdk.space.waitUntilAssetProcessed.should.have.been.called;
          wrapper.vm.contentfulExtensionSdk.space.publishAsset.should.have.been.called;
        });

        it('assigns the published image to the entry', async() => {
          const wrapper = factory();
          const item = apiResponse().object;
          await wrapper.vm.populateFields(item);
          wrapper.vm.entry.fields.image.setValue.should.have.been.calledWith({
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'abcdef'
            }
          });
        });
      });
    });
  });
});
