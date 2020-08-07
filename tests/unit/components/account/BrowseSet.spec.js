import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import BrowseSet from '../../../../components/account/BrowseSet.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(BrowseSet, {
  localVue,
  mocks: {
    $path: (opts) => `/item/${opts.params.pathMatch}`,
    $i18n: {
      locale: 'en'
    },
    $t: () => {}
  }
});

const setItems = [
  {
    europeanaId: '/123/abc',
    dcTitle: { def: ['Record 123/abc'] },
    edmPreview: 'https://www.example.org/abc.jpg',
    edmDataProvider: ['Provider 123']
  },
  {
    europeanaId: '/123/def',
    dcTitle: { def: ['Record 123/def'] },
    edmPreview: 'https://www.example.org/def.jpg',
    edmDataProvider: ['Provider 123']
  }
];

describe('components/account/BrowseSet', () => {
  it('it renders a card for each item of the user set', () => {
    const wrapper = factory();
    wrapper.setProps({
      items: setItems
    });
    const renderedItems =  wrapper.findAll('[data-qa="set item"]');

    renderedItems.at(0).attributes().href.should.endWith(`/item${setItems[0].europeanaId}`);
    renderedItems.at(1).attributes().href.should.endWith(`/item${setItems[1].europeanaId}`);
  });
});
