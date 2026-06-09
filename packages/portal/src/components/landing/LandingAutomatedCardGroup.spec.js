import nock from 'nock';
import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import * as backendFetchModule from '@/utils/backendFetch.js';

import LandingAutomatedCardGroup from '@/components/landing/LandingAutomatedCardGroup.vue';

const localVue = createLocalVue();

const EUROPEANA_NUMBERS = 'Europeana numbers';

const factory = (propsData) => shallowMountNuxt(LandingAutomatedCardGroup, {
  localVue,
  propsData,
  mocks: {
    $i18n: { n: (num) => `${num}` },
    $nuxt: { context: { $config: { redis: {} } } },
    $t: key => key
  },
  stubs: ['b-container', 'b-col']
});

describe('components/landing/LandingAutomatedCardGroup', () => {
  const backendFetch = sinon.stub(backendFetchModule, 'backendFetch').resolves({});

  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('fetch()', () => {
    describe('when rendering on the client', () => {
      describe('for Europeana numbers', () => {
        const propsData = { genre: EUROPEANA_NUMBERS };

        it('fetches cached data from the backend', async() => {
          const wrapper = factory(propsData);
          await wrapper.vm.fetch();

          expect(backendFetch.calledWith(
            'cache',
            [
              [
                'matomo/visits',
                'items/type-counts',
                'collections/organisations/count'
              ]
            ],
            wrapper.vm.$nuxt.context
          )).toBe(true);
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
