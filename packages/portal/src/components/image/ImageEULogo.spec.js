import { createLocalVue, shallowMount } from '@vue/test-utils';
import EULogo from '@/components/image/ImageEULogo.vue';

const localVue = createLocalVue();

const factory = (locale) => shallowMount(EULogo, {
  localVue,
  mocks: {
    $i18n: {
      locale
    },
    $t: (key) => key
  }
});

describe('components/image/ImageEULogo', () => {
  it('displays a localised EU logo', async() => {
    const wrapper = factory('nl');

    const localisedLogo =  wrapper.vm.localisedEULogo;
    expect(localisedLogo).toEqual('nl-Funded by the EU_NEG.svg'); // as returned by @tests/unit/fileTransformer.cjs
  });
  describe('when no logo exists for the current locale', () => {
    it('falls back to English EU logo', async() => {
      const wrapper = factory('eu');

      const localisedLogo =  wrapper.vm.localisedEULogo;
      expect(localisedLogo).toEqual('en-Funded by the EU_NEG.svg'); // as returned by @tests/unit/fileTransformer.cjs
    });
  });
});
