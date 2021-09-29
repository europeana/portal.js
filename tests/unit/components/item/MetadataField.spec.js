import { shallowMount } from '@vue/test-utils';
import MetadataField from '@/components/item/MetadataField.vue';

const $i18n = {
  locales: [{ code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }],
  locale: 'en'
};

const factory = () => shallowMount(MetadataField, {
  mocks: {
    $t: (key) => key,
    $config: { app: { internalLinkDomain: null, features: { translatedItems: false } } },
    $i18n
  }
});

describe('components/item/MetadataField', () => {
  const wrapper = factory();

  context('when there is a langMapped value as data', () => {
    const props = { name: 'dcCreator', fieldData: { def: ['Artist'] } };

    describe('when there is an entity field in def', () => {
      const entityObj = { about: 'entity_uri', prefLabel: { def: ['Entity Name Undefined 1', 'Entity Name Undefined 2'], en: ['English name'] } };
      const props = { name: 'dcCreator', fieldData: { def: ['Artist', entityObj] } };
      it('outputs the context specific translated label', async() => {
        await wrapper.setProps(props);

        const fieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="literal value"]');
        const entityFieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="entity value"] entityfield-stub');
        fieldValue.text().should.eq('Artist');
        entityFieldValue.attributes('value').should.eq('English name');
      });
    });

    describe('a labelled field', () => {
      it('outputs the translated field label', async() => {
        await wrapper.setProps(props);

        const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
        fieldName.text().should.eq('fieldLabels.default.dcCreator');
      });

      describe('a labelled field with a labelling context', () => {
        const props = {
          name: 'edmRights',
          fieldData: { def: 'http://rightsstatements.org/vocab/InC/1.0/' },
          context: 'webResource'
        };
        it('outputs the context specific translated label', async() => {
          await wrapper.setProps(props);

          const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
          fieldName.text().should.eq('fieldLabels.webResource.edmRights');
        });
      });

      context('with labelling disabled', () => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist'] }, labelled: false };
        it('does not output a label', async() => {
          await wrapper.setProps(props);

          const label = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
          label.exists().should.be.false;
        });
      });
    });

    describe('field values', () => {
      describe('metadata origin labels', () => {
        context('when the field has a translation source', () => {
          it('outputs a translation label for a single value', async() => {
            const props = { name: 'dcCreator', fieldData: { en: ['Artist'], translationSource: 'automated' }, metadataLanguage: 'en' };
            const wrapper = factory();

            await wrapper.setProps(props);
            const translationTooltip = wrapper.find('metadataoriginlabel-stub');
            translationTooltip.attributes().translationsource.should.eq('automated');
          });

          it('outputs a translation label for a multiple values', async() => {
            const props = { name: 'dcCreator', fieldData: { en: ['Artist1', 'Artist2'],  translationSource: 'automated' }, metadataLanguage: 'en' };
            const wrapper = factory();

            await wrapper.setProps(props);

            const translationTooltip = wrapper.find('metadataoriginlabel-stub');
            translationTooltip.attributes().translationsource.should.eq('automated');
          });
        });
      });

      it('outputs a single value', async() => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist'] } };
        const wrapper = factory();

        await wrapper.setProps(props);

        const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
        fieldValue.text().should.eq(props.fieldData.def[0]);
      });

      it('outputs multiple values', async() => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist1', 'Artist2'] } };
        const wrapper = factory();

        await wrapper.setProps(props);

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        fieldValues.at(0).text().should.eq(props.fieldData.def[0]);
        fieldValues.at(1).text().should.eq(props.fieldData.def[1]);
      });

      it('optionally limits the number of values output', async() => {
        const props = { name: 'dcCreator', fieldData: { def: ['Artist1', 'Artist2'] }, limit: 1 };
        const wrapper = factory();

        await wrapper.setProps(props);

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        fieldValues.at(0).text().should.eq(props.fieldData.def[0]);
        fieldValues.at(1).text().should.eq('formatting.ellipsis');
      });

      describe('URIs', () => {
        context('with omitUrisIfOtherValues set to true', () => {
          it('omits them if there are other values in any language', async() => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://example.org/unresolvable'], pl: ['Polish Value'] }, omitUrisIfOtherValues: true  };
            const wrapper = factory();

            await wrapper.setProps(props);

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            fieldValue.text().should.eq(props.fieldData.pl[0]);
          });

          it('omits them if there are other values', async() => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/base/123', 'Artist'] }, omitUrisIfOtherValues: true };
            const wrapper = factory();

            await wrapper.setProps(props);

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            fieldValue.text().should.eq(props.fieldData.def[1]);
          });

          it('only include them if there are no other values in any other language', async() => {
            const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/base/123'] }, omitUrisIfOtherValues: true };
            const wrapper = factory();

            await wrapper.setProps(props);

            const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
            fieldValue.text().should.eq(props.fieldData.def[0]);
          });
          context('with the omitAllUris setting set to true', () => {
            const options = { omitUrisIfOtherValues: true, omitAllUris: true };

            it('ommits them if there are other values in any language', async() => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/base/123'], pl: ['Polish Value'] }, ...options };
              const wrapper = factory();

              await wrapper.setProps(props);

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              fieldValue.text().should.eq(props.fieldData.pl[0]);
            });

            it('omits them if there are other values', async() => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/base/123', 'Artist'] }, ...options };
              const wrapper = factory();

              await wrapper.setProps(props);

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              fieldValue.text().should.eq(props.fieldData.def[1]);
            });

            it('omits them if it is the only value', async() => {
              const props = { name: 'dcCreator', fieldData: { def: ['http://data.europeana.eu/agent/base/123'] }, ...options };
              const wrapper = factory();

              await wrapper.setProps(props);

              const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
              fieldValue.exists().should.be.false;
            });
          });
        });
      });
    });

    context('when value is not available in the preferred languages', () => {
      const props = { name: 'dcTitle', fieldData: { de: ['Hammerflügel'] } };

      it('uses the first available value in any language', async() => {
        const wrapper = factory();

        await wrapper.setProps(props);

        const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
        fieldValue.text().should.include(props.fieldData.de);
      });
    });
  });

  context('when there is a string value as data', () => {
    const props = { name: 'dcCreator', fieldData: 'Artist' };

    it('outputs the field value', async() => {
      const wrapper = factory();

      await wrapper.setProps(props);

      const fieldValue = wrapper.find('[data-qa="metadata field"] ul [data-qa="literal value"]');
      fieldValue.text().should.include('Artist');
    });
  });

  context('when there is a value of an array of strings as data', () => {
    const props = { name: 'dcCreator', fieldData: ['Artist', 'Author'] };

    it('outputs the field values', async() => {
      const wrapper = factory();

      await wrapper.setProps(props);

      const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
      fieldValues.should.have.lengthOf(2);
    });
  });
  context('when there is a linked value', () => {
    context('when the link has a url', () => {
      const props = {
        name: 'edmDataProvider',
        fieldData: {
          url: 'http://www.mimo-db.eu/MIMO/infodoc/ged/view.aspx?eid=OAI_IMAGE_PROJECTS_LIB_ED_AC_UK_10683_17533',
          value: { def: [{ about: 'entity_uri', prefLabel: { en: ['University of Edinburgh'] } }] }
        }
      };

      it('outputs a field wrapped in a link', async() => {
        const wrapper = factory();

        await wrapper.setProps(props);

        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="entity link"]');
        fieldValues.exists().should.be.true;
      });
    });
    context('when the link has no url', () => {
      const props = {
        name: 'edmDataProvider',
        fieldData: {
          url: undefined,
          value: { en: ['National Library of Estonia'] }
        }
      };

      it('outputs a literal value instead of a link', async() => {
        const wrapper = factory();

        await wrapper.setProps(props);

        const link = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="entity link"]');
        const fieldValues = wrapper.findAll('[data-qa="metadata field"] ul [data-qa="literal value"]');
        link.exists().should.be.false;
        fieldValues.exists().should.be.true;
      });
    });
  });
});
