import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PageFooter from '../../../components/PageFooter.vue';
//import { __RewireAPI__ as PageFooterRewireAPI } from '../../../components/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const dummyLinkGroup = {
  sys: { type: 'Array' },
  total: 1,
  skip: 0,
  limit: 1,
  items: [ { sys: { id: '100', type: 'Entry' }, fields: {
    identifier: 'footer',
    links: [
      {
        sys: { id: '123' },
        fields: { url: 'https://www.example.org', text: 'Example link' }
      },
      {
        sys: { id: '456' },
        fields: { url: 'https://www.europeana.eu', text: 'Europeana link' }
      }
    ]
  } } ],
  mocks: { $t: () => {} }
};
const dummyContentful = {
  getEntries: () => {
    return new Promise((resolve) => {
      resolve(dummyLinkGroup);
    });
  }
};

PageFooter.__Rewire__('contentfulClient', dummyContentful);

const factory = () => shallowMount(PageFooter, {
  localVue,
  mocks: {
    $t: () => {}
    //contentfulClient: dummyContentful
  }
});

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe('components/search/PageFooter', () => {
  it('it contains elements for each link', async () => {
    const wrapper = factory();
    await sleep(20);
    const renderedList = wrapper.findAll('footer ul li');
    renderedList.length.should.eq(2);
    //dummyLinkGroup.items[0].links[0].fields.url
  });
});
