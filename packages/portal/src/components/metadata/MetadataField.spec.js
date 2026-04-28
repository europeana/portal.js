import { shallowMount } from '@vue/test-utils';
import MetadataField from '@/components/metadata/MetadataField.vue';

const $i18n = {
  locales: [{ code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }],
  locale: 'en'
};

const factory = ({ props, translationExists = true }) => shallowMount(MetadataField, {
  propsData: props,
  mocks: {
    $t: (key) => key,
    $te: () => translationExists,
    $config: { app: { internalLinkDomain: null } },
    $features: { translatedItems: false },
    $i18n
  },
  provide: {
    deBias: {
      definitions: {},
      terms: {}
    },
    metadataLanguage: null
  },
  stubs: ['ColourSwatch']
});

describe('components/metadata/MetadataField', () => {
  describe('when there is a langMapped value as data', () => {
    const props = { name: 'dcCreator', fieldData: { def: ['Artist'] } };

    describe('when there is an entity field in def', () => {
      it('outputs the context specific translated label', () => {
        const entityObj = { about: 'entity_uri', prefLabel: { def: ['Entity Name Undefined 1', 'Entity Name Undefined 2'], en: ['English name'] } };
        const props = { name: 'dcCreator', fieldData: { def: ['Artist', entityObj] } };
        const wrapper = factory({ props });

        const fieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="literal value"]');
        const entityFieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="entity value"] itementityfield-stub');
        expect(fieldValue.text()).toBe('Artist');
        expect(entityFieldValue.attributes('text')).toBe('English name');
      });
    });

    describe('a labelled field', () => {
      it('outputs the translated field label', () => {
        const wrapper = factory({ props });

        const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
        expect(fieldName.text()).toBe('fieldLabels.default.dcCreator');
      });

      describe('a labelled field with a labelling context', () => {
        describe('with the context in the field name', () => {
          const props = {
            name: 'webResourceEdmRights',
            fieldData: { def: 'http://rightsstatements.org/vocab/InC/1.0/' },
            context: 'webResource'
          };

          it('strips the context from the field name to translate the label', () => {
            const wrapper = factory({ props });

            const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
            expect(fieldName.text()).toBe('fieldLabels.webResource.edmRights');
          });
        });

        describe('without the context in the field name', () => {
          const props = {
            name: 'dcTitle',
            fieldData: { en: 'Title' },
            context: 'webResource'
          };

          it('outputs the context specific translated label', () => {
            const wrapper = factory({ props });

            const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
            expect(fieldName.text()).toBe('fieldLabels.webResource.dcTitle');
          });
        });
      });

      describe('with no translated label', () => {
        it('uses the name from the API for the label', () => {
          const wrapper = factory({ props, translationExists: false });

          const label = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
          expect(label.text()).toEqual(props.name);
        });
      });
      describe('with labelling disabled', () => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist'] }, labelled: false };
        it('does not output a label', () => {
          const wrapper = factory({ props });

          const label = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
          expect(label.exists()).toBe(false);
        });
      });
    });

    describe('field values', () => {
      describe('metadata origin labels', () => {
        describe('when the field has a translation source', () => {
          it('outputs a translation label for a single value', () => {
            const props = { name: 'dcCreator', fieldData: { en: ['Artist'], translationSource: 'automated' }, metadataLanguage: 'en' };
            const wrapper = factory({ props });

            const translationTooltip = wrapper.find('metadataoriginlabel-stub');
            expect(translationTooltip.attributes().translationsource).toBe('automated');
          });

          it('outputs a translation label for a multiple values', () => {
            const props = { name: 'dcCreator', fieldData: { en: ['Artist1', 'Artist2'],  translationSource: 'automated' }, metadataLanguage: 'en' };
            const wrapper = factory({ props });

            const translationTooltip = wrapper.find('metadataoriginlabel-stub');
            expect(translationTooltip.attributes().translationsource).toBe('automated');
          });
        });
      });

      it('outputs a single value', () => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist'] } };
        const wrapper = factory({ props });

        const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
        expect(fieldValue.text()).toBe(props.fieldData.def[0]);
      });

      it('outputs multiple values', () => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist1', 'Artist2'] } };
        const wrapper = factory({ props });

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        expect(fieldValues.at(0).text()).toBe(props.fieldData.def[0]);
        expect(fieldValues.at(1).text()).toBe(props.fieldData.def[1]);
      });

      it('optionally limits the number of values output', () => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist1', 'Artist2'] }, limit: 1 };
        const wrapper = factory({ props });

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        expect(fieldValues.at(0).text()).toBe(props.fieldData.def[0]);
        expect(fieldValues.at(1).text()).toBe('…');
      });

      describe('when the value might have a vocabulary lookup', () => {
        const props = { name: 'edmIntendedUsage', fieldData: ['http://data.europeana.eu/vocabulary/usageArea/Research'] };

        describe('and the value has a translation', () => {
          it('renders the translation string', () => {
            const wrapper = factory({ props, translationExists: true });

            const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');

            expect(fieldValues.at(0).text()).toBe('fieldValues.edmIntendedUsage.research');
          });
        });

        describe('but there is no existing translation', () => {
          it('renders the value without lookup', () => {
            const wrapper = factory({ props, translationExists: false });

            const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');

            expect(fieldValues.at(0).text()).toBe(props.fieldData[0]);
          });
        });
      });

      describe('URIs', () => {
        describe('with omitUrisIfOtherValues set to true', () => {
          it('omits them if there are other values in any language', () => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://example.org/unresolvable'], pl: ['Polish Value'] }, omitUrisIfOtherValues: true  };
            const wrapper = factory({ props });

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            expect(fieldValue.text()).toBe(props.fieldData.pl[0]);
          });

          it('omits them if there are other values', () => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/123', 'Artist'] }, omitUrisIfOtherValues: true };
            const wrapper = factory({ props });

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            expect(fieldValue.text()).toBe(props.fieldData.def[1]);
          });

          it('only include them if there are no other values in any other language', () => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/123'] }, omitUrisIfOtherValues: true };
            const wrapper = factory({ props, translationExists: false });

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            expect(fieldValue.text()).toBe(props.fieldData.def[0]);
          });
          describe('with the omitAllUris setting set to true', () => {
            const options = { omitUrisIfOtherValues: true, omitAllUris: true };

            it('ommits them if there are other values in any language', () => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/123'], pl: ['Polish Value'] }, ...options };
              const wrapper = factory({ props });

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              expect(fieldValue.text()).toBe(props.fieldData.pl[0]);
            });

            it('omits them if there are other values', () => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/123', 'Artist'] }, ...options };
              const wrapper = factory({ props });

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              expect(fieldValue.text()).toBe(props.fieldData.def[1]);
            });

            it('omits them if it is the only value', () => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/123'] }, ...options };
              const wrapper = factory({ props });

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              expect(fieldValue.exists()).toBe(false);
            });
          });
        });
      });
    });

    describe('when value is not available in the preferred languages', () => {
      const props = { name: 'dcTitle', fieldData: { de: ['Hammerflügel'] } };

      it('uses the first available value in any language', () => {
        const wrapper = factory({ props });

        const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
        expect(fieldValue.text()).toContain(props.fieldData.de[0]);
      });
    });
  });

  describe('when there is a string value as data', () => {
    const props = { name: 'dcCreator', fieldData: 'Artist' };

    it('outputs the field value', () => {
      const wrapper = factory({ props });

      const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
      expect(fieldValue.text()).toContain('Artist');
    });
  });

  describe('when there is a value of an array of strings as data', () => {
    const props = { name: 'dcCreator', fieldData: ['Artist', 'Author'] };

    it('outputs the field values', () => {
      const wrapper = factory({ props });

      const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
      expect(fieldValues.length).toBe(2);
    });
  });
  describe('when there is a linked entity value', () => {
    describe('when the link has a url', () => {
      const props = {
        name: 'edmDataProvider',
        fieldData: {
          url: 'http://www.mimo-db.eu/MIMO/infodoc/ged/view.aspx?eid=OAI_IMAGE_PROJECTS_LIB_ED_AC_UK_10683_17533',
          value: { def: [{ about: 'entity_uri', prefLabel: { en: ['University of Edinburgh'] } }] }
        }
      };

      it('outputs a field wrapped in a link', () => {
        const wrapper = factory({ props });

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="entity link"]');
        expect(fieldValues.exists()).toBe(true);
      });
    });
    describe('when there is a url value', () => {
      const props = {
        name: 'linkAsString',
        fieldData: {
          url: 'https://www.example.eu/linkToSomewhere',
          value: 'linkToSomewhere'
        }
      };

      it('outputs a field wrapped in a link', () => {
        const wrapper = factory({ props });

        const fieldValues = wrapper.findAll('[data-qa="literal value"] smartlink-stub');
        expect(fieldValues.exists()).toBe(true);
      });
    });
    describe('when the link has no url', () => {
      const props = {
        name: 'edmDataProvider',
        fieldData: {
          def: [{ prefLabel: { en: ['National Library of Estonia'] } }]
        }
      };

      it('outputs a literal value instead of a link', () => {
        const wrapper = factory({ props });

        const link = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="entity link"]');
        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        expect(link.exists()).toBe(false);
        expect(fieldValues.exists()).toBe(true);
      });
    });

    describe('isValidFieldData', () => {
      describe('when the field name is timestampCreated or timestampUpdate', () => {
        describe('and the field value equals the unix epoch', () => {
          const props = {
            name: 'timestampCreated',
            fieldData: '1970-01-01T00:00:00.000Z'
          };

          it('is `false`', () => {
            const wrapper = factory({ props });

            expect(wrapper.vm.isValidFieldData).toBe(false);
          });
        });
      });

      describe('when the field name is edmUgc', () => {
        const props = {
          name: 'edmUgc',
          fieldData: 'true'
        };

        it('is `false`', () => {
          const wrapper = factory({ props });

          expect(wrapper.vm.isValidFieldData).toBe(false);
        });
      });
    });
  });

  describe('when there is a colour value', () => {
    it('renders the colour swatch component', () => {
      const props = {
        name: 'edmComponentColor',
        fieldData: ['#000000']
      };
      const wrapper = factory({ props });

      expect(wrapper.find('colourswatch-stub').exists()).toBe(true);
    });
  });

  describe('when there is a Time value (ebucoreDuration)', () => {
    describe('rendering and formatting the number', () => {
      describe('when there is single minute value', () => {
        const props = {
          name: 'ebucoreDuration',
          fieldData: ['150000']
        };

        it('removes leading zeros', () => {
          const wrapper = factory({ props });
          const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');

          expect(fieldValue.text()).toEqual('2:30');
        });
      });

      describe('when there is a decimal minute value', () => {
        const props = {
          name: 'ebucoreDuration',
          fieldData: ['850000']
        };

        it('removes leading zeros from the hours', () => {
          const wrapper = factory({ props });
          const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');

          expect(fieldValue.text()).toEqual('14:10');
        });
      });

      describe('when there is a single second value', () => {
        const props = {
          name: 'ebucoreDuration',
          fieldData: ['5432']
        };

        it('removes leading zeros removes leading zeros up to the minute value', () => {
          const wrapper = factory({ props });
          const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');

          expect(fieldValue.text()).toEqual('0:05');
        });
      });

      describe('when there is a multiple hour long value', () => {
        const props = {
          name: 'ebucoreDuration',
          fieldData: ['55555000']
        };

        it('displays the whole value', () => {
          const wrapper = factory({ props });
          const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');

          expect(fieldValue.text()).toEqual('15:25:55');
        });
      });
    });
  });
});
