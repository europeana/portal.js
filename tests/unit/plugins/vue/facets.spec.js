import { createLocalVue, shallowMount } from '@vue/test-utils';

import plugin from '@/plugins/vue/facets';

const component = {
  template: '<div></div>'
};

const defaultMocks = {
  $tNull: () => null,
  $tcNull: () => null,
  $store: {
    getters: {
      'search/collection': null
    }
  }
};

const localVue = createLocalVue();
localVue.use(plugin);

const factory = (mocks = defaultMocks) => shallowMount(component, {
  localVue,
  mocks
});

describe('plugins/vue/facets', () => {
  it('adds $tFacetName() to Vue', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$tFacetName).toBe('function');
  });

  it('adds $tFacetOption() to Vue', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$tFacetOption).toBe('function');
  });

  describe('$tFacetName()', () => {
    const facetName = 'CREATOR';

    describe('when collection is set in store, and collection-specific l10n key exists for the facet', () => {
      const mocks = {
        $tcNull: (key) => key === 'collections.fashion.facets.CREATOR.name' ? 'Designer' : null,
        $store: {
          getters: {
            'search/collection': 'fashion'
          }
        }
      };

      it('uses that key', () => {
        const wrapper = factory(mocks);

        expect(wrapper.vm.$tFacetName(facetName)).toBe('Designer');
      });
    });

    describe('when collection is not set in store', () => {
      describe('but generic l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: (key) => key === 'facets.CREATOR.name' ? 'Creator' : null,
          $store: {
            getters: {
              'search/collection': null
            }
          }
        };

        it('uses that key', () => {
          const wrapper = factory(mocks);

          expect(wrapper.vm.$tFacetName(facetName)).toBe('Creator');
        });
      });

      describe('and no generic l10n key exists for the facet', () => {
        it('just returns the facet name parameter', () => {
          const wrapper = factory();

          expect(wrapper.vm.$tFacetName(facetName)).toBe('CREATOR');
        });
      });
    });
  });

  describe('$tFacetOption()', () => {
    describe('for MIME_TYPE facet', () => {
      const facetName = 'MIME_TYPE';
      const fieldValue = 'image/jpeg';

      it('uses media type label', () => {
        const wrapper = factory();

        expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('JPEG');
      });

      describe('mediaTypeLabel', () => {
        it('favours translated value', () => {
          const wrapper = factory({
            $tNull: () => 'Plain text',
            $store: {
              getters: {
                'search/collection': null
              }
            }
          });

          const facetName = 'MIME_TYPE';
          const fieldValue = 'text/plain';

          expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('Plain text');
        });

        describe('fallback with no translation', () => {
          it('uppercases the subtype', () => {
            const wrapper = factory();
            const facetName = 'MIME_TYPE';
            const fieldValue = 'image/jpeg';

            expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('JPEG');
          });

          it('removes a leading "x-" from the subtype', () => {
            const wrapper = factory();

            const facetName = 'MIME_TYPE';
            const fieldValue = 'audio/x-flac';

            expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('FLAC');
          });
        });
      });
    });

    describe('not for MIME_TYPE facet', () => {
      it('uses generic label', () => {
        const wrapper = factory();

        const facetName = 'TYPE';
        const fieldValue = 'VIDEO';

        expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('VIDEO');
      });

      describe('with escaped set to `true`', () => {
        it('removes quotes from the field value', () => {
          const wrapper = factory();

          const facetName = 'TYPE';
          const fieldValue = '"IMAGE"';

          expect(wrapper.vm.$tFacetOption(facetName, fieldValue, true)).toBe('IMAGE');
        });

        it('removes Lucene special character escaping', () => {
          const wrapper = factory();

          const facetName = 'DATA_PROVIDER';
          const fieldValue = '"Nederlands Bakkerijmuseum \\"Het Warme Land\\""';

          expect(wrapper.vm.$tFacetOption(facetName, fieldValue, true)).toBe('Nederlands Bakkerijmuseum "Het Warme Land"');
        });
      });

      it('translates the field value', () => {
        const wrapper = factory({
          $tNull: () => 'Image',
          $store: {
            getters: {
              'search/collection': null
            }
          }
        });

        const facetName = 'TYPE';
        const fieldValue = 'IMAGE';

        expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('Image');
      });

      it('falls back to the field value if no translation', () => {
        const wrapper = factory();

        const facetName = 'TYPE';
        const fieldValue = 'IMAGE';

        expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('IMAGE');
      });

      describe('with theme-specific field label pattern', () => {
        it('removes it', () => {
          const wrapper = factory({
            $tNull: () => null,
            $store: {
              getters: {
                'search/collection': 'fashion'
              }
            }
          });

          const facetName = 'CREATOR';
          const fieldValue = 'Chanel (Designer)';

          expect(wrapper.vm.$tFacetOption(facetName, fieldValue)).toBe('Chanel');
        });
      });
    });

    // describe('when collection is set in store, and collection-specific l10n key exists for the facet', () => {
    //   const mocks = {
    //     $tcNull: (key) => key === 'collections.fashion.facets.CREATOR.name' ? 'Designer' : null,
    //     $store: {
    //       getters: {
    //         'search/collection': 'fashion'
    //       }
    //     }
    //   };

    //   it('uses that key', () => {
    //     const wrapper = factory(mocks);

    //     expect(wrapper.vm.$tFacetName(facetName)).toBe('Designer');
    //   });
    // });

    // describe('when collection is not set in store', () => {
    //   describe('but generic l10n key exists for the facet', () => {
    //     const mocks = {
    //       $tcNull: (key) => key === 'facets.CREATOR.name' ? 'Creator' : null,
    //       $store: {
    //         getters: {
    //           'search/collection': null
    //         }
    //       }
    //     };

    //     it('uses that key', () => {
    //       const wrapper = factory(mocks);

    //       expect(wrapper.vm.$tFacetName(facetName)).toBe('Creator');
    //     });
    //   });

    //   describe('and no generic l10n key exists for the facet', () => {
    //     const mocks = {
    //       $tcNull: () => null,
    //       $store: {
    //         getters: {
    //           'search/collection': null
    //         }
    //       }
    //     };

    //     it('just returns the facet name parameter', () => {
    //       const wrapper = factory(mocks);

    //       expect(wrapper.vm.$tFacetName(facetName)).toBe('CREATOR');
    //     });
    //   });
    // });
  });
});
