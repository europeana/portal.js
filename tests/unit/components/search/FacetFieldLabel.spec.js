import { createLocalVue, mount } from '@vue/test-utils';
import FacetFieldLabel from '../../../../components/search/FacetFieldLabel.vue';

const localVue = createLocalVue();

const factory = (propsData = {}, mocks = {}) => mount(FacetFieldLabel, {
  localVue,
  propsData,
  mocks
});

describe('components/search/FacetFieldLabel', () => {
  context('for a generic facet', () => {
    it('translates the field value', () => {
      const wrapper = factory({
        facetName: 'TYPE',
        fieldValue: 'IMAGE'
      }, {
        $t: (key) => `Translated ${key}`,
        $te: () => true
      });

      wrapper.find('span').text().should.eq('Translated facets.TYPE.options.IMAGE');
    });

    it('falls back to the field value if no translation', () => {
      const wrapper = factory({
        facetName: 'TYPE',
        fieldValue: 'IMAGE'
      }, {
        $te: () => false
      });

      wrapper.find('span').text().should.eq('IMAGE');
    });
  });

  context('for the MIME_TYPE facet', () => {
    it('translates the field value', () => {
      const wrapper = factory({
        facetName: 'MIME_TYPE',
        fieldValue: 'text/plain'
      }, {
        $t: (key) => `Translated ${key}`,
        $te: () => true
      });

      wrapper.find('span').text().should.eq('Translated facets.MIME_TYPE.options.text/plain');
    });

    describe('fallback with no translation', () => {
      it('uppercases the subtype', () => {
        const wrapper = factory({
          facetName: 'MIME_TYPE',
          fieldValue: 'image/jpeg'
        }, {
          $te: () => false
        });

        wrapper.find('span').text().should.eq('JPEG');
      });

      it('removes a leading "x-" from the subtype', () => {
        const wrapper = factory({
          facetName: 'MIME_TYPE',
          fieldValue: 'audio/x-flac'
        }, {
          $te: () => false
        });

        wrapper.find('span').text().should.eq('FLAC');
      });
    });
  });

  context('with prefixing', () => {
    it('prefixes with the translated facet name', () => {
      const wrapper = factory({
        facetName: 'TYPE',
        fieldValue: 'TEXT',
        prefixed: true
      }, {
        $t: (key, options) => `${options.label} ${options.value}`,
        $tc: (key) => key,
        $te: () => false
      });

      wrapper.find('span').text().should.eq('facets.TYPE.name TEXT');
    });
  });
});
