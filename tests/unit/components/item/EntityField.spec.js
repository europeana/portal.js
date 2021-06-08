import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import EntityField from '../../../../src/components/item/EntityField.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(EntityField, {
  localVue,
  propsData,
  mocks: {
    $path: () => 'localizedPath',
    $config: { app: { internalLinkDomain: null } }
  }
});

describe('components/item/EntityField', () => {
  describe('when it represents a Europeana Entity', () => {
    it('shows linked entity', () => {
      const wrapper = factory({ value: 'Painting', about: 'http://data.europeana.eu/concept/base/47' });

      const fieldValue = wrapper.find('span a');
      fieldValue.attributes().href.should.eq('localizedPath');
      fieldValue.text().should.eq('Painting');
    });
  });

  describe('when it represents a provider entity', () => {
    it('shows just the label', () => {
      const wrapper = factory({ value: 'Painting', about: 'http://example.org/entities/painting' });

      const fieldValue = wrapper.find('span');
      fieldValue.text().should.eq('Painting');
    });
  });
});
