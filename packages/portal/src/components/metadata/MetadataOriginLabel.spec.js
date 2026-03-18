import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MetadataOriginLabel from '@/components/metadata/MetadataOriginLabel.vue';

const $i18n = {
  locales: [{ code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }],
  locale: 'en'
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MetadataOriginLabel, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key) => key,
    $i18n
  }
});

describe('components/metadata/MetadataOriginLabel', () => {
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
