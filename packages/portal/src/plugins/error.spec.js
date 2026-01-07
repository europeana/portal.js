import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import * as errorPlugin from '@/plugins/error';
import { shallowMountNuxt } from '@test/utils.js';

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
        t: (key) => key,
        te: () => true
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

  describe('default export', () => {
    const ctx = { store: { registerModule: sinon.spy() } };
    const inject = sinon.spy();

    it('injects handleError into Nuxt context', () => {
      errorPlugin.default(ctx, inject);

      expect(inject.calledWith('error', sinon.match.func)).toBe(true);
    });

    it('registers Vuex store module', () => {
      errorPlugin.default(ctx, inject);

      expect(ctx.store.registerModule.calledWith('error', sinon.match.has('state'))).toBe(true);
    });
  });

  describe('storeModule', () => {
    const extractStoreModule = () => {
      let storeModule;
      const ctx = { store: { registerModule: (name, mod) => storeModule = mod } };
      const inject = () => {};

      errorPlugin.default(ctx, inject);

      return storeModule;
    };

    it('is namespaced', () => {
      const storeModule = extractStoreModule();

      expect(storeModule.namespaced).toBe(true);
    });

    describe('state', () => {
      it('has error, defaulted to null', () => {
        const storeModule = extractStoreModule();

        expect(storeModule.state().error).toBeNull();
      });
    });

    describe('mutations', () => {
      describe('set', () => {
        it('updates error on the state', () => {
          const storeModule = extractStoreModule();
          const state = { error: null };
          const error = { statusCode: 404 };

          storeModule.mutations.set(state, error);

          expect(state.error).toBe(error);
        });
      });
    });
  });

  describe('handleError', () => {
    const triggerHandleError = (errorOrStatusCode, handleErrorOptions = {}, mocks = {}) => {
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError, ...mocks }
      });

      let error;
      try {
        wrapper.vm.$error(errorOrStatusCode, handleErrorOptions);
      } catch (e) {
        error = e;
      }

      return { error, wrapper };
    };

    it('converts number to the equivalent HTTP error', () => {
      const errorOrStatusCode = 400;
      const $fetchState = { pending: true };

      const { error } = triggerHandleError(errorOrStatusCode, {}, { $fetchState });

      expect(error.statusCode).toBe(errorOrStatusCode);
      expect(error.message).toBe('Bad Request');
    });

    it('sets HTTP status code in Nuxt context', () => {
      const errorOrStatusCode = 404;
      const $fetchState = { pending: true };

      const { wrapper } = triggerHandleError(errorOrStatusCode, {}, { $fetchState });

      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(errorOrStatusCode);
    });

    it('stores the error in Vuex state', () => {
      const errorOrStatusCode = 404;

      const { wrapper } = triggerHandleError(errorOrStatusCode);

      expect(wrapper.vm.$store.commit.calledWith('error/set', sinon.match.has('statusCode', 404))).toBe(true);
    });

    describe('when error has a code already', () => {
      const errorOrStatusCode = { code: 'authKeyDuplicateKey', statusCode: 400 };
      const options = { scope: 'page' };
      const $fetchState = { pending: true };

      it('is preserved', () => {
        const { error } = triggerHandleError(errorOrStatusCode, options, { $fetchState });

        expect(error.code).toBe('authKeyDuplicateKey');
      });
    });

    describe('when scope and status code resolve to a known code', () => {
      const errorOrStatusCode = { statusCode: 403 };
      const options = { scope: 'gallery' };
      const $fetchState = { pending: true };

      it('decorates error with scoped code', () => {
        const { error } = triggerHandleError(errorOrStatusCode, options, { $fetchState });

        expect(error.code).toBe('galleryUnauthorised');
      });
    });

    describe('when status code resolves to a generic code', () => {
      const errorOrStatusCode = { statusCode: 404 };
      const $fetchState = { pending: true };

      it('decorates error with code', () => {
        const { error } = triggerHandleError(errorOrStatusCode, {}, { $fetchState });

        expect(error.code).toBe('genericNotFound');
      });
    });

    // TODO: is this behaviour we want? if so, re-implement
    // describe('when scope and status code do not resolve to a known code', () => {
    //   const errorOrStatusCode = { statusCode: 400 };
    //
    //   it('throws the error', () => {
    //     const wrapper = factory({
    //       mocks: { $error: errorPlugin.handleError }
    //     });
    //
    //     let error;
    //     try {
    //       wrapper.vm.$error(errorOrStatusCode);
    //     } catch (e) {
    //       error = e;
    //     }
    //
    //     expect(error).toBe(errorOrStatusCode);
    //   });
    // });

    describe('when Nuxt fetch state is not pending', () => {
      const $fetchState = { pending: false };

      it('does not throw error', () => {
        const errorOrStatusCode = { statusCode: 403 };

        const { error } = triggerHandleError(errorOrStatusCode, {}, { $fetchState });

        expect(error).toBeUndefined();
      });
    });

    describe('i18n', () => {
      const translateStub = sinon.stub().returnsArg(0);
      translateStub.withArgs('errorMessage.genericNotFound').returns({
        title: 'Not Found',
        description: 'It may have been deleted'
      });
      const $i18n = { t: translateStub, te: () => true };

      it('translates all strings for localised error message', () => {
        const $fetchState = { pending: true };
        const errorOrStatusCode = { statusCode: 404 };

        const { error } = triggerHandleError(errorOrStatusCode, {}, { $fetchState, $i18n });

        expect(error.i18n.title).toBe('errorMessage.genericNotFound.title');
        expect(error.i18n.description).toBe('errorMessage.genericNotFound.description');
      });
    });
  });
});
