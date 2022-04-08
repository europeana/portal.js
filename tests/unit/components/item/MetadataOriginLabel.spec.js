import { createLocalVue, shallowMount } from '@vue/test-utils';
import MetadataOriginLabel from '@/components/item/MetadataOriginLabel.vue';

const $i18n = {
  locales: [{ code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }],
  locale: 'en'
};

const localVue = createLocalVue();
localVue.directive('b-tooltip', {});

const factory = () => shallowMount(MetadataOriginLabel, {
  localVue,
  mocks: {
    $t: (key) => key,
    $i18n
  }
});

describe('components/item/MetadataOriginLabel', () => {
  describe('when the field was translated', () => {
    const props = { translationSource: 'automated' };
    const wrapper = factory();
    it('shows a label', async() => {
      await wrapper.setProps(props);

      const button = wrapper.find('[data-qa="translation tooltip"]');
      expect(button.attributes().title).toBe('multilingual.automated');
    });
  });
  describe('when the field was enriched', () => {
    const props = { translationSource: 'enrichment' };
    const wrapper = factory();
    it('shows a label', async() => {
      await wrapper.setProps(props);

      const button = wrapper.find('[data-qa="translation tooltip"]');
      expect(button.attributes().title).toBe('multilingual.enrichment');
    });
  });
});
