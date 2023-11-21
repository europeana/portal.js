import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import LandingAutomatedCardGroup from '@/components/landing/LandingAutomatedCardGroup.vue';

const localVue = createLocalVue();

const EUROPEANA_NUMBERS = 'Europeana numbers';
const axiosGetStub = sinon.stub();

const factory = (propsData) => shallowMountNuxt(LandingAutomatedCardGroup, {
  localVue,
  propsData,
  mocks: {
    $axios: {
      get: axiosGetStub
    },
    $config: { redis: {} },
    $i18n: { n: (num) => `${num}` },
    $t: key => key
  },
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingAutomatedCardGroup', () => {
  describe('fetch()', () => {
    const propsData = { genre: EUROPEANA_NUMBERS };
    describe('when rendering on the client', () => {
      beforeEach(() => {
        axiosGetStub.withArgs('/_api/cache?id=matomo/visits&id=items/type-counts&id=collections/organisations/count').resolves({ data: 2000 });
      });
      afterEach(() => {
        axiosGetStub.reset();
      });
      it('gets the data from the cache API endpoint', async() => {
        const wrapper = factory(propsData);
        await wrapper.vm.fetch();
        expect(axiosGetStub.calledWith('/_api/cache?id=matomo/visits&id=items/type-counts&id=collections/organisations/count')).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('roundedNumber', () => {
      it('rounds down a number to a precision of two', () => {
        const wrapper = factory();

        expect(wrapper.vm.roundedNumber(199)).toBe('190');
        expect(wrapper.vm.roundedNumber(21367)).toBe('21000');
        expect(wrapper.vm.roundedNumber(3591434)).toBe('3500000');
      });
    });
  });
});
