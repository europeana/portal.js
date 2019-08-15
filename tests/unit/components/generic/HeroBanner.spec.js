import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HeroBanner from '../../../../components/generic/HeroBanner.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(HeroBanner, {
  localVue,
  mocks: {
    localePath: (opts) => `/record/${opts.params.pathMatch}`
  }
});

describe('components/generic/HeroBanner', () => {
  it('has a background image', () => {
    const wrapper = factory();
    wrapper.setProps({ heroImage: 'https://example.org' });

    const hero = wrapper.find('[data-qa="hero banner"]');
    hero.attributes().style.should.contain('https://example.org');
  });

  it('has a title', () => {
    const wrapper = factory();
    wrapper.setProps({ headline: 'Welcome at Europeana' });

    const title = wrapper.find('[data-qa="hero banner"] h2');
    title.text().should.contain('Welcome at Europeana');
  });

  it('has a description', () => {
    const wrapper = factory();
    wrapper.setProps({ description: 'Explore artworks, artefacts, books, films and music' });

    const description = wrapper.find('[data-qa="hero banner"] .lead');
    description.text().should.contain('Explore artworks, artefacts, books, films and music');
  });

  it('has a link', () => {
    const wrapper = factory();
    wrapper.setProps({ identifier: '15508/DG2014_46_12' });

    const link = wrapper.find('[data-qa="hero banner"] a');
    link.attributes().href.should.contain('15508/DG2014_46_12');
  });

  it('has an attribution', () => {
    const wrapper = factory();
    wrapper.setProps({ attribution: 'Johannes Vermeer' });

    const attribution = wrapper.find('[data-qa="hero banner"] a');
    attribution.text().should.contain('Johannes Vermeer');
  });

  it('has a rights statement', () => {
    const wrapper = factory();
    wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

    const rights = wrapper.find('[data-qa="hero banner"] a span');
    rights.text().should.contain('http://rightsstatements.org/vocab/InC/1.0/');
  });
});
