import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/image-harvester/index';
import sinon from 'sinon';
// import { apiError } from '@/plugins/europeana/utils';

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
    });
  });
});
