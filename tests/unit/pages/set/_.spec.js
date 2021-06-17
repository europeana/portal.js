import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '../../../../src/pages/set/_';
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
      recommendations: []
    };
  },
  mocks: {
    $config: { app: { features: {} } },
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
    context('when the description exists', () => {
      const set = { id: 1, title: { en: 'My set' }, description: { en: 'A test set' }, creator: { nickname: 'Tester' } };
      it('uses the set title', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        headMeta.filter(meta => meta.property === 'og:description').length.should.eq(1);
        headMeta.find(meta => meta.property === 'og:description').content.should.eq('A test set');
      });
    });
    context('when the description does NOT exists', () => {
      const set = { id: 1, title: { en: 'My set' }, creator: { nickname: 'Tester' } };
      it('uses the set title', () => {
        const wrapper = factory(set);

        const headMeta = wrapper.vm.head().meta;

        headMeta.filter(meta => meta.property === 'og:description').length.should.eq(0);
      });
    });
  });
});
