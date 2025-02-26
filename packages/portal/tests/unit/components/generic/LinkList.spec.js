import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';
import LinkList from '@/components/generic/LinkList.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const factory = (items) => shallowMount(LinkList, {
  propsData: {
    title: 'title text',
    items: items || [
      { url: 'https://www.example.org',
        text: 'Example link',
        background: 'https://www.example.org/image' },
      { url: 'https://www.europeana.eu', text: 'Europeana link' }
    ]
  },
  localVue
});

describe('components/generic/LinkList', () => {
  it('contains a title', () => {
    const wrapper = factory();
    const linkListTitle = wrapper.find('[data-qa="link list title"]');
    expect(linkListTitle.text()).toContain('title text');
  });

  it('contains elements for each link item', () => {
    const wrapper = factory();
    const linkList = wrapper.find('[data-qa="link list"]');
    const renderedList = linkList.findAll('.item');
    expect(renderedList.length).toBe(2);
  });

  describe('when an item contains a background image', () => {
    it('shows as background image of a link', () => {
      const wrapper = factory();
      const linkList = wrapper.find('[data-qa="link list"]');
      const linkWithBackground = linkList.findAll('[style^="background-image"]');
      expect(linkWithBackground.length).toBe(1);
    });
  });

  describe('when an item has been delete or depublished', () => {
    it('does not show this item as a link', () => {
      const wrapper = factory([
        { url: 'https://www.example.org',
          text: 'Example link',
          background: 'https://www.example.org/image' },
        { url: 'https://www.europeana.eu', text: 'Europeana link' },
        null
      ]);

      const linkList = wrapper.find('[data-qa="link list"]');
      const renderedList = linkList.findAll('.item');
      expect(renderedList.length).toBe(2);
    });
  });
});

