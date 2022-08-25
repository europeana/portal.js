import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HeroHeader from '@/components/browse/HeroHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const requiredProps = {
  heroImage: { image: { url: 'https://example.org' } },
  title: 'Welcome to Europeana',
  description: 'Explore millions of items!'
};

const factory = () => mount(HeroHeader, {
  localVue,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $path: () => '/',
    $t: (key) => key
  },
  propsData: requiredProps
});

describe('components/generic/HeroHeader', () => {
  it('has a background image', () => {
    const wrapper = factory();

    const hero = wrapper.find('[data-qa="hero banner"]');
    expect(hero.attributes().style).toContain('https://example.org');
  });

  it('has a title', () => {
    const wrapper = factory();

    const title = wrapper.find('[data-qa="hero banner"] h1');
    expect(title.text()).toContain('Welcome to Europeana');
  });

  it('has a description', () => {
    const wrapper = factory();

    const description = wrapper.find('[data-qa="hero banner"] .lead');
    expect(description.text()).toContain('Explore millions of items!');
  });

  it('has a cta', async() => {
    const wrapper = factory();
    await wrapper.setProps({ cta: { text: 'Click here!', url: 'http://www.example.org/cta' } });

    const cta = wrapper.find('a');
    expect(cta.text()).toContain('Click here!');
    expect(cta.attributes('href')).toContain('http://www.example.org/cta');
  });
});
