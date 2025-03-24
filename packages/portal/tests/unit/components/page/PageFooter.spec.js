import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import SmartLink from '@/components/generic/SmartLink.vue';
import PageFooter from '@/components/page/PageFooter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const factory = ({ mocks = {} } = {}) => shallowMount(PageFooter, {
  localVue,
  mocks: {
    $t: (key) => key,
    ...mocks
  },
  stubs: {
    FeedbackWidget: true
  }
});

describe('components/page/PageFooter', () => {
  it('contains the language selector', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      enableLanguageSelector: true
    });
    const selector = wrapper.find('[data-qa="language selector"]');

    expect(selector.isVisible()).toBe(true);
  });

  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links = wrapper.vm.moreInfo.links;

    expect(links.some((link) => link.text === 'footer.navigation.about')).toBe(true);
  });

  it('displays links to supporting technical partners', () => {
    const wrapper = factory();
    const partners = wrapper.find('[data-qa="supporting technical partners"]');

    expect(partners.isVisible()).toBe(true);
  });
});
