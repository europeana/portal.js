import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemLanguageSelector from '@/components/item/ItemLanguageSelector';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});
i18n.locales = [
  { code: 'en', name: 'English', iso: 'en-GB' },
  { code: 'de', name: 'Deutsch', iso: 'de-DE' }
];

const factory = (propsData, metadataLang) => mount(ItemLanguageSelector, {
  localVue,
  propsData,
  i18n,
  mocks: {
    $t: (key) => {
      if (key === 'multilingual.differentLanguage') {
        return 'a different language';
      } else if (key === 'multilingual.originalLanguage') {
        return 'original language';
      } else {
        return '';
      }
    },
    $route: {
      path: 'item/example/123',
      query: {
        metadataLang
      }
    }
  },
  stubs: {
    NuxtLink: true
  }
});

describe('components/item/ItemLanguageSelector', () => {
  context('when the UI language and the edmLanguage are different it', () => {
    it('suggests to translate the item metadata to the UI language ', () => {
      const wrapper = factory({ itemLanguage: 'de' });

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      suggestion.text().should.eq('Would you like to see this item in English?');
    });
  });
  context('when the UI language and the edmLanguage are the same it', () => {
    it('suggests to translate the item metadata to different language ', () => {
      const wrapper = factory({ itemLanguage: 'en' });

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      suggestion.text().should.eq('Would you like to see this item in a different language?');
    });
  });
  context('when the item metadata is translated', () => {
    it('suggests to return to the original language ', () => {
      const wrapper = factory({ itemLanguage: 'en' }, 'de');

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      suggestion.text().should.eq('Would you like to see this item in original language?');
    });
  });
  describe('translateParams', () => {
    it('adds the metadataLang query with the provided language code', () => {
      const wrapper = factory({ itemLanguage: 'en' });
      const newParams = wrapper.vm.translateParams('de');
      newParams.query.metadataLang.should.eq('de');
    });
  });
});
