import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';
import LinkGroup from '@/components/generic/LinkGroup.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const factory = (links) => shallowMount(LinkGroup, {
  propsData: {
    caption: 'Caption text',
    links: links || [
      { url: 'https://www.example.org', text: 'Example link' },
      { url: 'https://www.europeana.eu', text: 'Europeana link' }
    ]
  },
  localVue
});

describe('components/generic/LinkGroup', () => {
  it('contains a caption title', () => {
    const wrapper = factory();
    const footerCaption = wrapper.find('[data-qa="link group caption"]');
    footerCaption.text().should.contain('Caption text');
  });

  it('contains elements for each link', () => {
    const wrapper = factory();
    const footerLinks = wrapper.find('[data-qa="link group links"]');
    const renderedList = footerLinks.findAll('li');
    renderedList.length.should.eq(2);
  });
  context('when an item has been delete or unpublished', () => {
    it('does not show this item as a link', () => {
      const wrapper = factory([
        { url: 'https://www.example.org',
          text: 'Example link' },
        { url: 'https://www.europeana.eu', text: 'Europeana link' },
        null
      ]);

      const linkList = wrapper.find('[data-qa="link group links"]');
      const renderedList = linkList.findAll('.link');
      renderedList.length.should.eq(2);
    });
  });
});
