import { shallowMount } from '@vue/test-utils';
import Metadata from '../../../../components/record/Metadata.vue';

const factory = () => shallowMount(Metadata);

describe('components/record/Metadata', () => {
  describe('each property of `fields`', () => {
    it('is output in a code block', () => {
      const wrapper = factory();
      const props = { fields: { dcTitle: ['Art'], dcCreator: { def: 'Artist' } } };

      wrapper.setProps(props);

      const fields = wrapper.findAll('[data-qa="metadata field"]');
      fields.at(0).find('div strong').text().should.eq('dcTitle');
      fields.at(0).find('pre code').text().should.eq(JSON.stringify(props.fields.dcTitle, null, 2));
      fields.at(1).find('div strong').text().should.eq('dcCreator');
      fields.at(1).find('pre code').text().should.eq(JSON.stringify(props.fields.dcCreator, null, 2));
    });
  });
});
