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

const factory = (propsData) => mount(ItemLanguageSelector, {
  localVue,
  propsData,
  i18n,
  mocks: {
    $t: () => {},
    $route: () => {}
  }
});

describe('components/item/ItemLanguageSelector', () => {
  context('suggests to translate the item metadata', () => {
    it('to different language when the UI language and the edmLanguage are the same', () => {
      const wrapper = factory({ itemLanguage: 'en' });

      const suggestion = wrapper.find('[data-qa="translate item suggestion"]');
      console.log(suggestion);
    });
  });
});
