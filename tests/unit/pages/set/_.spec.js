import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/set/_';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});

const $i18n = {
  locale: 'en'
};

const factory = (set = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      recommendations: [],
      userIsEntityEditor: false
    };
  },
  mocks: {
    $features: {},
    $pageHeadTitle: key => key,
    $t: key => key,
    $tc: key => key,
    $i18n,
    $auth: {
      loggedIn: false
    },
    $fetchState: { pending: false },
    $store: {
      dispatch: storeDispatch,
      state: {
        auth: { loggedIn: false },
        set: { active: set }
      }
    }
  }
});

describe('Set page', () => {
  describe('head()', () => {
    describe('when the set has a description', () => {
      const set = { id: 1, title: { en: 'My set' }, description: { en: 'A test set' }, creator: { nickname: 'Tester' } };

      it('is used as the content for the description meta tag', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.name === 'description').length).toBe(1);
        expect(headMeta.find(meta => meta.name === 'description').content).toBe('A test set');
      });

      it('is used as the content for the og:description meta tag', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(1);
        expect(headMeta.find(meta => meta.property === 'og:description').content).toBe('A test set');
      });
    });

    describe('when the set does NOT have a description', () => {
      const set = { id: 1, title: { en: 'My set' }, creator: { nickname: 'Tester' } };

      it('omits the description meta tag', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.name === 'description').length).toBe(0);
      });

      it('omits the og:description meta tag', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(0);
      });
    });
  });
});
