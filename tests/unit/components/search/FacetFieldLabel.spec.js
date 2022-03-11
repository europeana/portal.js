import { createLocalVue, shallowMount } from '@vue/test-utils';

import FacetFieldLabel from '@/components/search/FacetFieldLabel.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    search: {
      namespaced: true,
      getters: {
        formatFacetFieldLabel: () => () => null,
        collection: () => 'fashion'
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
    describe('with escaped prop set to `true`', () => {
      it('removes quotes from the field value', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'TYPE',
            fieldValue: '"IMAGE"',
            escaped: true
          },
          mocks: {
            $tNull: () => null
          }
        });

        expect(wrapper.vm.genericLabel).toBe('IMAGE');
      });

      it('removes Lucene special character escaping', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'DATA_PROVIDER',
            fieldValue: '"Nederlands Bakkerijmuseum \\"Het Warme Land\\""',
            escaped: true
          },
          mocks: {
            $tNull: () => null
          }
        });

        expect(wrapper.vm.genericLabel).toBe('Nederlands Bakkerijmuseum "Het Warme Land"');
      });
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

      expect(wrapper.vm.genericLabel).toBe('Image');
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

      expect(wrapper.vm.genericLabel).toBe('IMAGE');
    });

    describe('with theme-specific field label pattern', () => {
      it('removes it', () => {
        const wrapper = factory({
          propsData: {
            facetName: 'CREATOR',
            fieldValue: 'Chanel (Designer)'
          },
          mocks: {
            $tNull: () => null
          }
        });

        expect(wrapper.vm.genericLabel).toBe('Chanel');
      });
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

      expect(wrapper.vm.mediaTypeLabel).toBe('Plain text');
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

        expect(wrapper.vm.mediaTypeLabel).toBe('JPEG');
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

        expect(wrapper.vm.mediaTypeLabel).toBe('FLAC');
      });
    });
  });

  describe('label', () => {
    describe('for MIME_TYPE facet', () => {
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

        expect(wrapper.vm.label).toBe('JPEG');
      });
    });

    describe('not for MIME_TYPE facet', () => {
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

        expect(wrapper.vm.label).toBe('VIDEO');
      });
    });
  });
});
