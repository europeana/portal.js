import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '../../../components/generic/SmartLink.vue';
import PageFooter from '../../../components/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const dummyStore = {
  state: {
    'link-group': {
      links: {
        footer: [
          { url: 'https://www.example.org', text: 'Example link' },
          { url: 'https://www.europeana.eu', text: 'Europeana link' }
        ]
      }
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

describe('components/search/PageFooter', () => {
  it('it contains elements for each link', async() => {
    const wrapper = factory();
    const renderedList = wrapper.findAll('footer ul li');
    renderedList.length.should.eq(2);
  });

  it('contains the language selector', () => {
    const wrapper = factory();
    wrapper.setProps({
      enableLanguageSelector: true
    });
    const selector = wrapper.find('[data-qa="language selector"]');

    selector.isVisible().should.equal(true);
  });
  
});
