import { shallowMount } from '@vue/test-utils';
import MetadataField from '../../../../components/record/MetadataField.vue';

const factory = () => shallowMount(MetadataField);

describe('components/record/MetadataField', () => {
  const props = { name: 'dcCreator', value: { def: 'Artist' } };

  describe('a labeled field', () => {
    it('outputs the field label', () => {
      const wrapper = factory();

      wrapper.setProps(props);

      const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
      fieldName.text().should.eq('Creators');
    });
  });

  describe('any non labeled field', () => {
    it('outputs the field name', () => {
      const props = { name: 'rdfAbout', value: { def: 'Artist' } };

      const wrapper = factory();

      wrapper.setProps(props);

      const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
      fieldName.text().should.eq('rdfAbout');
    });
  });

  it('outputs the field value in a code block', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="value"]');
    fieldValue.text().should.eq(JSON.stringify(props.value, null, 2));
  });
});
