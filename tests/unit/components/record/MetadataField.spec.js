import { mount } from '@vue/test-utils';
import MetadataField from '../../../../components/record/MetadataField.vue';

const factory = () => mount(MetadataField, {
  mocks: {
    $t: (key) => key
  }
});

describe('components/record/MetadataField', () => {
  const props = { name: 'dcCreator', value: { def: ['Artist'] } };

  describe('a labelled field', () => {
    const wrapper = factory();

    it('outputs the  translated field label', () => {
      wrapper.setProps(props);

      const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
      fieldName.text().should.eq('fieldLabels.default.dcCreator');
    });

    describe('a labelled field with a labelling context', () => {
      const props = { name: 'edmRights', value: { def: 'http://rightsstatements.org/vocab/InC/1.0/' }, context: 'webResource' };
      it('outputs the context specific translated label', () => {

        wrapper.setProps(props);

        const fieldName = wrapper.find('[data-qa="metadata field"] [data-qa="label"]');
        fieldName.text().should.eq('fieldLabels.webResource.edmRights');
      });
    });
  });

  it('outputs the field value', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldValue = wrapper.find('[data-qa="metadata field"] [data-qa="value"]');
    fieldValue.text().should.include(props.value.def);
  });
});
