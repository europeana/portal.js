import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Metadata from '../../../../components/record/Metadata.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(Metadata, {
  localVue
});

describe('components/record/Metadata', () => {
  describe('each property of `fields`', () => {
    it('is output in a code block', () => {
      const wrapper = factory();
      const props = { fields: { dcTitle: ['Art'], dcCreator: { def: 'Artist' } } };

      wrapper.setProps(props);

      const fields = wrapper.findAll('[data-qa="field"]');
      fields.at(0).find('div strong').text().should.eq('dcTitle');
      fields.at(0).find('pre code').text().should.match(/\[\s+"Art"\s+\]/);
      fields.at(1).find('div strong').text().should.eq('dcCreator');
      fields.at(1).find('pre code').text().should.match(/{\s+"def": "Artist"\s+}/);
    });
  });
});
