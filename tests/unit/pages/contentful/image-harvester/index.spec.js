import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/image-harvester/index';
import sinon from 'sinon';
import { apiError } from '@/plugins/europeana/utils';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const apiResponse = {
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
        }
      }
    ],
    proxies: [
      {
        about: '/proxy/provider/2063612/NO_280_001',
        dcCreator: {
          def: ['http://viaf.org/viaf/61624802']
        }
      }
    ],
    webResources: [
      {
        about: 'https://www.dropbox.com/s/lh4ous7fk4u41lj/NO_Madonna_Munch.M.00841.jpg?raw=1',
        webResourceEdmRights: {
          def: ['http://creativecommons.org/licenses/by-nc/4.0/'],
          ebucoreHasMimeType: 'image/jpeg'
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
};

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
          wrapper.vm.$apis.record.$axios.get.resolves({ data: apiResponse });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse.object.about));
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
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse.object.about));
          wrapper.vm.showError = sinon.spy();
          wrapper.vm.populateFields = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.populateFields.should.not.have.been.called;
          wrapper.vm.showError.should.have.been.calledWith(`Unable to harvest "${apiResponse.object.about}". Please make sure the item can be accessed on the Record API. Error: "${apiErrorResponse.response.data.error}"`);
        });
      });

      context('when the entry fields can not be set', () => {
        it('shows an error', async() => {
          const wrapper = factory();
          wrapper.vm.$apis.record.$axios.get.resolves({ data: apiResponse });
          sinon.replace(wrapper.vm, 'getUrlFromUser', sinon.fake.returns(apiResponse.object.about));
          sinon.replace(wrapper.vm, 'populateFields', () => {
            throw Error('Contentful error');
          });
          wrapper.vm.showError = sinon.spy();

          await wrapper.vm.harvestImage();
          wrapper.vm.showError.should.have.been.calledWith('There was a problem updating the entry. Contentful error');
        });
      });
    });
  });
});
