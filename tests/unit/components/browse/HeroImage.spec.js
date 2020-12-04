import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HeroImage from '../../../../components/browse/HeroHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(HeroImage, {
  localVue,
  mocks: {
    $path: () => '/',
    $t: (key) => key
  }
});

describe('components/generic/HeroImage', () => {
  it('has a background image', () => {
    const wrapper = factory();
    wrapper.setProps({ imageUrl: 'https://example.org' });

    const hero = wrapper.find('[data-qa="hero banner"]');
    hero.attributes().style.should.contain('https://example.org');
  });

  it('has a title', () => {
    const wrapper = factory();
    wrapper.setProps({ header: 'Welcome at Europeana' });

    const title = wrapper.find('[data-qa="hero banner"] h1');
    title.text().should.contain('Welcome at Europeana');
  });

  it('has a description', () => {
    const wrapper = factory();
    wrapper.setProps({ lead: 'Explore artworks, artefacts, books, films and music' });

    const description = wrapper.find('[data-qa="hero banner"] .lead');
    description.text().should.contain('Explore artworks, artefacts, books, films and music');
  });

  it('has an attribution', () => {
    const wrapper = factory();
    wrapper.setProps({ creator: 'Johannes Vermeer' });
    wrapper.vm.toggleCite();
    const attribution = wrapper.find('[data-qa="hero banner"] cite p span');
    attribution.text().should.contain('Johannes Vermeer');
  });
});
