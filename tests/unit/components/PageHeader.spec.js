import { createLocalVue, createWrapper, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import PageHeader from '../../../components/PageHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
const router = new VueRouter();

const factory = () => shallowMount(PageHeader, {
  localVue,
  router,
  mocks: {
    $t: () => {},
    localePath: (code) => window.location.href + code
  }
});

describe('components/search/PageHeader', () => {
  it('contains a search form', () => {
    const wrapper = factory();
    const form =  wrapper.find('[data-qa="search form"]');

    form.isVisible().should.equal(true);
  });

  it('contains the logo', () => {
    const wrapper = factory();

    const logo = wrapper.find('[data-qa="logo"]');
    logo.attributes().src.should.match(/\/logo\..+\.svg$/);
  });

  it('contains a language selector', () => {
    const wrapper = factory();
    const selector = wrapper.find('[data-qa="language selector"]');

    selector.isVisible().should.equal(true);
  });

  describe('submitSearchForm()', () => {
    it('emits submit:searchForm on $root', () => {
      const wrapper = factory();
      const rootWrapper = createWrapper(wrapper.vm.$root);

      wrapper.vm.submitSearchForm();
      rootWrapper.emitted()['submit:searchForm'].length.should.equal(1);
    });
  });
});
