import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchResult from '../../../../components/search/SearchResult.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchResult, {
  localVue
});

describe('components/search/SearchResult', () => {
  describe('result.edmPreview', () => {
    it('is displayed as an img element', () => {
      const wrapper = factory();

      wrapper.setProps({ result: { edmPreview: 'https://www.example.org/thumbnail.jpg' } });
      const image =  wrapper.find('img[data-qa~="edmPreview"]');

      image.attributes().src.should.eq('https://www.example.org/thumbnail.jpg');
    });
  });

  describe('result.fields properties', () => {
    it('is displayed as a code block if an Object', () => {
      const wrapper = factory();

      wrapper.setProps({ result: { fields: { dcSpatial: { fr: ['Paris'] } } } });

      const code =  wrapper.find('[data-qa~="dcSpatial"] pre code');
      code.text().should.match(/{\s+"fr": \[\s+"Paris"\s+\]\s+}/);
    });

    it('is displayed unadorned if a single value', () => {
      const wrapper = factory();

      wrapper.setProps({ result: { fields: { dcSpatial: ['Paris'] } } });

      const field =  wrapper.find('[data-qa~="dcSpatial"]');
      field.text().should.eq('Paris');
    });

    it('is displayed as a list if multi-value', () => {
      const wrapper = factory();

      wrapper.setProps({ result: { fields: { dcSpatial: ['Paris', 'London'] } } });

      const fields = wrapper.findAll('[data-qa~="dcSpatial"] ul li');
      fields.at(0).text().should.eq('Paris');
      fields.at(1).text().should.eq('London');
    });
  });
});
