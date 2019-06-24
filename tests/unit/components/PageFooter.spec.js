import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Hyperlink from '../../../components/generic/Hyperlink.vue';
import PageFooter from '../../../components/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('hyperlink', Hyperlink);

const dummyStore = {
  state: {
    footer: {
      links: [
        { url: 'https://www.example.org', text: 'Example link' },
        { url: 'https://www.europeana.eu', text: 'Europeana link' }
      ]
    }
  }
};

const factory = () => shallowMount(PageFooter, {
  localVue,
  mocks: {
    $t: () => {},
    $store: dummyStore
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
