import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import LandingAutomatedCardGroup from '@/components/landing/LandingAutomatedCardGroup.vue';

const localVue = createLocalVue();

const DS4CH_NUMBERS = 'Data space numbers';
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
    describe('when rendering on the client', () => {
      describe('for Europeana numbers', () => {
        const propsData = { genre: EUROPEANA_NUMBERS };
        const axiosArgs = '/_api/cache?id=matomo/visits&id=items/type-counts&id=collections/organisations/count';
        beforeEach(() => {
          axiosGetStub.withArgs(axiosArgs).resolves({ data: 2000 });
        });
        afterEach(() => {
          axiosGetStub.reset();
        });
        it('gets the data from the cache API endpoint', async() => {
          const wrapper = factory(propsData);
          await wrapper.vm.fetch();
          expect(axiosGetStub.calledWith(axiosArgs)).toBe(true);
        });
      });

      describe('for Data space numbers', () => {
        const propsData = { genre: DS4CH_NUMBERS };
        const axiosArgs = '/_api/cache?id=items/type-counts&id=dataspace/network-members&id=dataspace/data-providers&id=dataspace/hq-data&id=dataspace/api-requests';
        beforeEach(() => {
          axiosGetStub.withArgs(axiosArgs).resolves({ data: 2000 });
        });
        afterEach(() => {
          axiosGetStub.reset();
        });
        it('gets the data from the cache API endpoint', async() => {
          const wrapper = factory(propsData);
          await wrapper.vm.fetch();
          expect(axiosGetStub.calledWith(axiosArgs)).toBe(true);
        });
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
