import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import * as errorPlugin from '@/plugins/error';
import { shallowMountNuxt } from '../utils';

const component = {
  template: '<div></div>'
};
const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => {
  const wrapper = shallowMountNuxt(component, {
    localVue,
    mocks: {
      $fetchState: {},
      $i18n: {
        te: () => true,
        t: (key) => key
      },
      $nuxt: { context: { res: {} } },
      $store: {
        commit: sinon.spy()
      },
      ...mocks
    }
  });

  return wrapper;
};

describe('@/plugins/error', () => {
  afterEach(sinon.resetHistory);

  describe('handleError', () => {
    it('converts number to the equivalent HTTP error', () => {
      const errorOrCode = 400;
      const $fetchState = { pending: true };
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError, $fetchState }
      });

      let error;
      try {
        wrapper.vm.$error(errorOrCode);
      } catch (e) {
        error = e;
      }

      expect(error.statusCode).toBe(errorOrCode);
      expect(error.message).toBe('Bad Request');
    });

    it('converts string code to error', () => {
      const errorOrCode = 'setLocked';
      const $fetchState = { pending: true };
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError, $fetchState }
      });

      let error;
      try {
        wrapper.vm.$error(errorOrCode);
      } catch (e) {
        error = e;
      }

      expect(error.code).toBe('setLocked');
    });

    it('sets HTTP status code in Nuxt context', () => {
      const errorOrCode = 404;
      const $fetchState = { pending: true };
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError, $fetchState }
      });

      try {
        wrapper.vm.$error(errorOrCode);
      } catch (e) {
        //
      }

      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(errorOrCode);
    });

    it('stores the error in Vuex state', () => {
      const errorOrCode = 404;
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError }
      });

      wrapper.vm.$error(errorOrCode);

      expect(wrapper.vm.$store.commit.calledWith('error/set', sinon.match.has('statusCode', 404))).toBe(true);
    });

    describe('when scope and status code resolve to a known code', () => {
      const errorOrCode = { statusCode: 403 };
      const scope = 'gallery';
      const $fetchState = { pending: true };

      it('decorates error with code', () => {
        const wrapper = factory({
          mocks: { $error: errorPlugin.handleError, $fetchState }
        });

        let error;
        try {
          wrapper.vm.$error(errorOrCode, { scope });
        } catch (e) {
          error = e;
        }

        expect(error.code).toBe('galleryUnauthorised');
      });
    });

    describe('when status code resolves to a generic code', () => {
      const errorOrCode = { statusCode: 404 };
      const $fetchState = { pending: true };

      it('decorates error with code', () => {
        const wrapper = factory({
          mocks: { $error: errorPlugin.handleError, $fetchState }
        });

        let error;
        try {
          wrapper.vm.$error(errorOrCode);
        } catch (e) {
          error = e;
        }

        expect(error.code).toBe('genericNotFound');
      });
    });

    // TODO: is this behaviour we want? if so, re-implement
    // describe('when scope and status code do not resolve to a known code', () => {
    //   const errorOrCode = { statusCode: 400 };
    //
    //   it('throws the error', () => {
    //     const wrapper = factory({
    //       mocks: { $error: errorPlugin.handleError }
    //     });
    //
    //     let error;
    //     try {
    //       wrapper.vm.$error(errorOrCode);
    //     } catch (e) {
    //       error = e;
    //     }
    //
    //     expect(error).toBe(errorOrCode);
    //   });
    // });

    describe('when Nuxt fetch state is not pending', () => {
      const $fetchState = { pending: false };

      it('does not throw error', () => {
        const wrapper = factory({
          mocks: { $error: errorPlugin.handleError, $fetchState }
        });
        const errorOrCode = { statusCode: 403 };

        let error;
        try {
          wrapper.vm.$error(errorOrCode);
        } catch (e) {
          error = e;
        }

        expect(error).toBeUndefined();
      });
    });
  });
});
