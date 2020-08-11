import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetItems from '../../../../components/set/SetItems.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(SetItems, {
  localVue,
  propsData,
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

describe('components/set/SetItems', () => {
  it('it renders a card for each item of the user set', () => {
    const wrapper = factory({
      items: setItems
    });

    const renderedItems =  wrapper.findAll('[data-qa="set item"] a');

    renderedItems.at(0).attributes().href.should.endWith(`/item${setItems[0].europeanaId}`);
    renderedItems.at(1).attributes().href.should.endWith(`/item${setItems[1].europeanaId}`);
  });
});
