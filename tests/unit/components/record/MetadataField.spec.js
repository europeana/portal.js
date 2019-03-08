import { shallowMount } from '@vue/test-utils';
import MetadataField from '../../../../components/record/MetadataField.vue';

const factory = () => shallowMount(MetadataField);

describe('components/record/MetadataField', () => {
  const props = { name: 'dcCreator', value: { def: 'Artist' } };

  it('outputs the field name', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldName = wrapper.find('[data-qa="metadata field name"]');
    fieldName.text().should.eq(props.name);
  });

  it('outputs the field value in a code block', () => {
    const wrapper = factory();

    wrapper.setProps(props);

    const fieldValue = wrapper.find('[data-qa="metadata field value"]');
    fieldValue.text().should.eq(JSON.stringify(props.value, null, 2));
  });
});
