import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import EntityField from '@/components/item/EntityField.vue';

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

const fixtures = {
  europeanaEntity: { text: 'Painting', about: 'http://data.europeana.eu/concept/base/47' },
  providerEntity: { text: 'Painting', about: 'http://example.org/entities/painting' }
};

describe('components/item/EntityField', () => {
  describe('template', () => {
    describe('when it represents a Europeana Entity', () => {
      it('shows linked entity', () => {
        const wrapper = factory(fixtures.europeanaEntity);

        const fieldValue = wrapper.find('span a');
        expect(fieldValue.attributes().href).toBe('localizedPath');
        expect(fieldValue.text()).toBe('Painting');
      });
    });

    describe('when it represents a provider entity', () => {
      it('shows just the label', () => {
        const wrapper = factory(fixtures.europeanaEntity);

        const fieldValue = wrapper.find('span');
        expect(fieldValue.text()).toBe('Painting');
      });
    });
  });

  describe('computed', () => {
    describe('isEuropeanaEntity', () => {
      it('is `true` for Europeana entities', () => {
        const wrapper = factory(fixtures.europeanaEntity);

        expect(wrapper.vm.isEuropeanaEntity).toBe(true);
      });

      it('is `false` for provider entities', () => {
        const wrapper = factory(fixtures.providerEntity);

        expect(wrapper.vm.isEuropeanaEntity).toBe(false);
      });
    });

    describe('destination', () => {
      it('is extracts params from URI for Europeana entities', () => {
        const wrapper = factory(fixtures.europeanaEntity);

        expect(wrapper.vm.destination).toEqual({ id: '47', type: 'topic' });
      });

      it('uses URI for provider entities', () => {
        const wrapper = factory(fixtures.providerEntity);

        expect(wrapper.vm.destination).toBe(fixtures.providerEntity.about);
      });
    });
  });
});
