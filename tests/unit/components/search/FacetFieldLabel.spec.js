import { createLocalVue, shallowMount } from '@vue/test-utils';

import FacetFieldLabel from '../../../../src/components/search/FacetFieldLabel.vue';
import Vuex from 'vuex';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    search: {
      namespaced: true,
      getters: {
        formatFacetFieldLabel: () => () => null
      }
    }
  }
});

const factory = (options = {}) => shallowMount(FacetFieldLabel, {
  localVue,
  store,
  ...options
});

describe('components/search/FacetFieldLabel', () => {
  describe('genericLabel', () => {
    it('favours a formatted value from the store getter formatFacetFieldLabel', () => {
      const formatFacetFieldLabel = sinon.stub();
      formatFacetFieldLabel.returns('store formatted');
      const store = new Vuex.Store({
        modules: {
          search: {
            namespaced: true,
            getters: {
              formatFacetFieldLabel: () => formatFacetFieldLabel
            }
          }
        }
      });

      const wrapper = factory({
        propsData: {
          facetName: 'TYPE',
          fieldValue: '"IMAGE"'
        },
        store,
        mocks: {
          $tNull: () => null
        }
      });

      wrapper.vm.genericLabel.should.eq('store formatted');
    });

    it('removes quotes from the field value', () => {
      const wrapper = factory({
        propsData: {
          facetName: 'TYPE',
          fieldValue: '"IMAGE"'
        },
        mocks: {
          $tNull: () => null
        }
      });

      wrapper.vm.genericLabel.should.eq('IMAGE');
    });

    it('removes Lucene special character escaping', () => {
      const wrapper = factory({
        propsData: {
          facetName: 'DATA_PROVIDER',
          fieldValue: '"Nederlands Bakkerijmuseum \\"Het Warme Land\\""'
        },
        mocks: {
          $tNull: () => null
        }
      });

      wrapper.vm.genericLabel.should.eq('Nederlands Bakkerijmuseum "Het Warme Land"');
    });

    it('translates the field value', () => {
      const wrapper = factory({
        propsData: {
          facetName: 'TYPE',
          fieldValue: 'IMAGE'
        },
        mocks: {
          $tNull: () => 'Image'
        }
      });

      wrapper.vm.genericLabel.should.eq('Image');
    });

    it('falls back to the field value if no translation', () => {
      const wrapper = factory({
        propsData: {
          facetName: 'TYPE',
          fieldValue: 'IMAGE'
        },
        mocks: {
          $tNull: () => null
        }
      });

      wrapper.vm.genericLabel.should.eq('IMAGE');
    });
  });

  describe('mediaTypeLabel', () => {
    it('favours translated value', () => {
      const wrapper = factory({
        propsData: {
          facetName: 'MIME_TYPE',
          fieldValue: 'text/plain'
        },
        mocks: {
          $tNull: () => 'Plain text'
        }
      });

      wrapper.vm.mediaTypeLabel.should.eq('Plain text');
    });

    describe('fallback with no translation', () => {
      it('uppercases the subtype', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'MIME_TYPE',
            fieldValue: 'image/jpeg'
          },
          mocks: {
            $tNull: () => null
          }
        });

        wrapper.vm.mediaTypeLabel.should.eq('JPEG');
      });

      it('removes a leading "x-" from the subtype', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'MIME_TYPE',
            fieldValue: 'audio/x-flac'
          },
          mocks: {
            $tNull: () => null
          }
        });

        wrapper.vm.mediaTypeLabel.should.eq('FLAC');
      });
    });
  });

  describe('label', () => {
    context('for MIME_TYPE facet', () => {
      it('uses media type label', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'MIME_TYPE',
            fieldValue: 'image/jpeg'
          },
          mocks: {
            $tNull: () => null
          }
        });

        wrapper.vm.label.should.eq('JPEG');
      });
    });

    context('not for MIME_TYPE facet', () => {
      it('uses generic label', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'TYPE',
            fieldValue: 'VIDEO'
          },
          mocks: {
            $tNull: () => null
          }
        });

        wrapper.vm.label.should.eq('VIDEO');
      });
    });

    context('with prefixing', () => {
      it('prefixes with the translated facet name', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'TYPE',
            fieldValue: 'TEXT',
            prefixed: true
          },
          mocks: {
            $t: (key, options) => `${options.label}: ${options.value}`,
            $tNull: () => null,
            $tFacetName: (key) => key
          }
        });

        wrapper.vm.label.should.eq('TYPE: TEXT');
      });
    });
  });
});
