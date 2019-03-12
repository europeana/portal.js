import { mount } from '@vue/test-utils';
import MetadataField from '../../../../components/record/MetadataField.vue';

const factory = () => mount(MetadataField);

describe('components/record/MetadataField', () => {
  const props = { name: 'dcCreator', value: { def: ['Artist'] } };

  it('outputs the field name', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldName = wrapper.find('[data-qa="metadata field name"]');
    fieldName.text().should.eq(props.name);
  });

  it('outputs the field value', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldValue = wrapper.find('[data-qa="metadata field value"]');
    fieldValue.text().should.include(props.value.def);
  });
});
