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
  { code: 'de', name: 'Deutsch', iso: 'de-DE' },
  { code: 'nl', name: 'Nederlands', iso: 'nl-NL' }
];

const factory = (propsData) => mount(ItemLanguageSelector, {
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
        lang: propsData.metadataLanguage
      }
    }
  },
  stubs: {
    NuxtLink: true
  }
});

describe('components/item/ItemLanguageSelector', () => {
  context('when the record has a supported edmLanguage', () => {
    context('when no translations are applied', () => {
      it('suggests to translate the item metadata to other languages', () => {
        const wrapper = factory({ itemLanguage: 'de' });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        suggestion.text().should.contain('Would you like to see this item in');

        wrapper.findAll('[data-qa="remove item translation button"]').exists().should.be.false;
      });
    });
    context('when the UI language and the edmLanguage are different it', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ itemLanguage: 'de', metadataLanguage: 'de' });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');
        suggestion.text().should.contain('Would you like to see this item in');
        removeButton.text().should.eq('Stop translating this page to Deutsch.');
      });
    });
    context('when the UI language and the edmLanguage are the same it', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ itemLanguage: 'en', metadataLanguage: 'en' });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');
        suggestion.text().should.contain('Would you like to see this item in');
        removeButton.text().should.eq('Stop translating this page to English.');
      });
    });
    context('when the item metadata is different to the UI language', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ itemLanguage: 'de', metadataLanguage: 'en'  });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');
        suggestion.text().should.contain('Would you like to see this item in');
        removeButton.text().should.eq('Stop translating this page to English.');
      });
    });
    context('when the item metadata is different to a non-UI language', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ itemLanguage: 'de', metadataLanguage: 'nl'  });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');
        suggestion.text().should.contain('Would you like to see this item in');
        removeButton.text().should.eq('Stop translating this page to Nederlands.');
      });
    });
  });

  context('when the record has a unsupported edmLanguage', () => {
    context('when no translations are applied', () => {
      it('suggests to translate the item metadata to other languages', () => {
        const wrapper = factory({ itemLanguage: 'mul' });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        suggestion.text().should.contain('Would you like to see this item in');

        wrapper.findAll('[data-qa="remove item translation button"]').exists().should.be.false;
      });
    });
    context('when the UI language and the edmLanguage are different it', () => {
      it('suggests to translate the item metadata to other languages and offers to remove translations', () => {
        const wrapper = factory({ itemLanguage: 'mul', metadataLanguage: 'de' });

        const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
        const removeButton = wrapper.find('[data-qa="remove item translation button"]');
        suggestion.text().should.contain('Would you like to see this item in');
        removeButton.text().should.eq('Stop translating this page to Deutsch.');
      });
    });
  });

  describe('translateParams', () => {
    it('adds the lang query with the provided language code', () => {
      const wrapper = factory({ itemLanguage: 'en' });
      const newParams = wrapper.vm.translateParams('de');
      newParams.query.lang.should.eq('de');
    });
  });
});
