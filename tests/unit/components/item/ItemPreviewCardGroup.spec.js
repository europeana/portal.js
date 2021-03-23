import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { VueMasonryPlugin } from 'vue-masonry';

import ItemPreviewCardGroup from '../../../../components/item/ItemPreviewCardGroup.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueMasonryPlugin);

const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();

const factory = () => {
  return shallowMount(ItemPreviewCardGroup, {
    localVue,
    stubs: ['client-only'],
    mocks: {
      $auth: { loggedIn: false },
      $config: { app: { internalLinkDomain: null } },
      $path: (opts) => `/item/${opts.params.pathMatch}`,
      $i18n: {
        locale: 'en'
      },
      $t: () => {},
      $store: {
        state: {
          set: { ...{ liked: [] }, ...{} }
        },
        getters: {
          'set/isLiked': storeIsLikedGetter
        },
        dispatch: storeDispatch
      },
      $apis: {
        record: {
          mediaProxyUrl: () => 'proxied'
        }
      }
    }
  });
};

const results = [
  {
    id: '/123/abc',
    dcTitleLangAware: { def: ['Record 123/abc'] },
    edmPreview: ['https://www.example.org/abc.jpg'],
    dataProvider: ['Provider 123']
  },
  {
    id: '/123/def',
    dcTitleLangAware: { def: ['Record 123/def'] },
    edmPreview: ['https://www.example.org/def.jpg'],
    dataProvider: ['Provider 123']
  }
];

describe('components/item/ItemPreviewCardGroup', () => {
  context('when view is grid', () => {
    it('renders each result with a link', () => {
      const wrapper = factory();

      wrapper.setProps({ value: results, view: 'grid' });

      const renderedResults =  wrapper.findAll('[data-qa="item preview"] a');
      console.log('WRAPPER', wrapper.html());

      renderedResults.at(0).attributes().href.should.endWith(`/item${results[0].id}`);
      renderedResults.at(1).attributes().href.should.endWith(`/item${results[1].id}`);
    });
  });

  context('when view is list', () => {
    it('renders each result with a link', () => {
      const wrapper = factory();

      wrapper.setProps({ value: results, view: 'list' });

      const renderedResults =  wrapper.findAll('div[data-qa="item preview"]');

      renderedResults.at(0).find('a').attributes().href.should.endWith(`/item${results[0].id}`);
      renderedResults.at(1).find('a').attributes().href.should.endWith(`/item${results[1].id}`);
    });
  });
});
