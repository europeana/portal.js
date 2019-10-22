import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ImageWithAttribution from '../../../../components/generic/ImageWithAttribution.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const propsData = {
  src: 'https://www.example.org/image.jpeg',
  attribution: {
    name: 'Something',
    creator: 'Someone',
    provider: 'Somewhere',
    rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/',
    url: 'http://www.example.org/'
  }
};

const factory = () => mount(ImageWithAttribution, {
  localVue,
  mocks: {
    localePath: (opts) => opts,
    $t: (key) => key
  },
  propsData
});

describe('components/generic/ImageWithAttribution', () => {
  it('shows the image', () => {
    const wrapper = factory();

    const img = wrapper.find('figure img');
    img.attributes().src.should.eq(propsData.src);
  });

  it('shows the attribution', () => {
    const wrapper = factory();

    const attributionText = [
      propsData.attribution.name,
      propsData.attribution.creator,
      propsData.attribution.provider
    ].join(', ');

    const cite = wrapper.find('figure figcaption cite');
    cite.text().should.include(attributionText);
  });

  it('links to the URL', () => {
    const wrapper = factory();

    const link = wrapper.find('figure figcaption a');
    link.attributes().href.should.eq(propsData.attribution.url);
  });

  it('shows the rights statement abbreviation', () => {
    const wrapper = factory();

    const link = wrapper.find('[data-qa="rights statement"]');
    link.text().should.eq('CC BY-ND');
  });
});
