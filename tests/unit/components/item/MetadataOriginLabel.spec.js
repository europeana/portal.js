import { createLocalVue, shallowMount } from '@vue/test-utils';
import MetadataOriginLabel from '@/components/item/MetadataOriginLabel.vue';

const $i18n = {
  locales: [{ code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }],
  locale: 'en'
};

const localVue = createLocalVue();
localVue.directive('b-tooltip', {});

const factory = (options = {}) => shallowMount(MetadataOriginLabel, {
  localVue,
  mocks: {
    $t: (key) => key,
    $config: { app: { features: { translatedItems: options.translatedItems || false } } },
    $i18n
  }
});

describe('components/item/MetadataOriginLabel', () => {
  describe('is feature toggle controlled', () => {
    const props = { translationSource: 'automated' };
    context('when translated items are enabled', async() => {
      const wrapper = factory({ translatedItems: true });
      it('shows a label', async() => {
        await wrapper.setProps(props);

        const button = wrapper.find('[data-qa="translation tooltip"]');
        button.attributes().title.should.eq('multilingual.automated');
      });
    });
    context('when translated items are NOT enabled', () => {
      const wrapper = factory({ translatedItems: false });
      it('does not show a label', async() => {
        await wrapper.setProps(props);

        const button = wrapper.find('[data-qa="translation tooltip"]');
        button.exists().should.be.false;
      });
    });
  });
});
