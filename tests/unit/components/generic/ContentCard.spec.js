import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCard from '../../../../components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ContentCard, {
  localVue
});

describe('components/generic/ContentCard', () => {
  it('includes a description', () => {
    const wrapper = factory();
    wrapper.setProps({ description: 'The Milkmaid by Vermeer' });

    const description =  wrapper.find('[data-qa="content card"] .card-text');
    description.text().should.eq('The Milkmaid by Vermeer');
  });

  it('has a link', () => {
    const wrapper = factory();
    wrapper.setProps({ url: 'https://example.org' });

    const link =  wrapper.find('[data-qa="content card"] .card-link');
    link.attributes().href.should.eq('https://example.org');
  });

  it('has an image', () => {
    const factory = () => mount(ContentCard, {
      localVue
    });

    const wrapper = factory();
    wrapper.setProps({ imageUrl: 'https://example.org' });

    const card =  wrapper.find('[data-qa="content card"]');

    card.find('img').attributes('src').should.eq('https://example.org');
  });

  it('has an alt', () => {
    const wrapper = factory();
    wrapper.setProps({ imageUrl: 'https://example.org', imageTitle: 'This is a picture of the Milkmaid' });

    const card =  wrapper.find('[data-qa="content card"]');
    card.attributes().imgalt.should.eq('This is a picture of the Milkmaid');
  });
});
