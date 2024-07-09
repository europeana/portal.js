import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentPrimaryCallToAction from '@/components/content/ContentPrimaryCallToAction.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testPropsData = { title: 'Title', text: 'Call to action!', link: { text: 'I am the link', url: 'https://example.org/call-to-action' } };

const factory = (propsData = testPropsData) => shallowMount(ContentPrimaryCallToAction, {
  localVue,
  propsData
});

describe('components/content/ContentPrimaryCallToAction', () => {
  describe('when a title is available', () => {
    it('shows a title', async() => {
      const wrapper = factory();

      const title = wrapper.find('[data-qa="primary cta title"');

      expect(title.text()).toBe('Title');
    });
  });
  describe('when there is no title', () => {
    it('no title exists', async() => {
      const propsDataWithoutTitle = { ...testPropsData };
      delete propsDataWithoutTitle.title;

      const wrapper = factory(propsDataWithoutTitle);

      const title = wrapper.find('[data-qa="primary cta title"');

      expect(title.exists()).toBe(false);
    });
  });

  it('shows text', async() => {
    const wrapper = factory();

    const cta = wrapper.find('.primary-cta-rich-text');

    expect(cta.text()).toBe('Call to action!');
  });

  it('shows the link with the text and no external link icon', async() => {
    const wrapper = factory();

    const cta = wrapper.find('smartlink-stub');
    expect(cta.text()).toBe('I am the link');
    expect(cta.vm.destination).toBe('https://example.org/call-to-action');
    expect(cta.vm.hideExternalIcon).toBe(true);
  });
});
