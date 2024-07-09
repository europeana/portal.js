import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';
import LinkGroup from '@/components/generic/LinkGroup.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const factory = (links) => shallowMount(LinkGroup, {
  propsData: {
    title: 'Title text',
    links: links || [
      { url: 'https://www.example.org', text: 'Example link' },
      { url: 'https://www.europeana.eu', text: 'Europeana link' }
    ]
  },
  localVue
});

describe('components/generic/LinkGroup', () => {
  it('contains a title', () => {
    const wrapper = factory();
    const footerTitle = wrapper.find('[data-qa="link group title"]');
    expect(footerTitle.text()).toContain('Title text');
  });

  it('contains elements for each link', () => {
    const wrapper = factory();
    const footerLinks = wrapper.find('[data-qa="link group links"]');
    const renderedList = footerLinks.findAll('li');
    expect(renderedList.length).toBe(2);
  });

  describe('when there are no links', () => {
    it('does not show a link list', async() => {
      const wrapper = factory();
      await wrapper.setProps({ links: [] });

      const linkList = wrapper.find('[data-qa="link group links"]');
      const renderedList = linkList.findAll('.link');
      expect(renderedList.length).toBe(0);
    });
  });

  describe('when an item has been delete or unpublished', () => {
    it('does not show this item as a link', () => {
      const wrapper = factory([
        { url: 'https://www.example.org',
          text: 'Example link' },
        { url: 'https://www.europeana.eu', text: 'Europeana link' },
        null
      ]);

      const linkList = wrapper.find('[data-qa="link group links"]');
      const renderedList = linkList.findAll('.link');
      expect(renderedList.length).toBe(2);
    });
  });
});
