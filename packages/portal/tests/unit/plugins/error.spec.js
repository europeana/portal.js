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
    const triggerHandleError = (errorOrCode, handleErrorOptions = {}, mocks = {}) => {
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError, ...mocks }
      });

      let error;
      try {
        wrapper.vm.$error(errorOrCode, handleErrorOptions);
      } catch (e) {
        error = e;
      }

      return { error, wrapper };
    };

    it('converts number to the equivalent HTTP error', () => {
      const errorOrCode = 400;
      const $fetchState = { pending: true };

      const { error } = triggerHandleError(errorOrCode, {}, { $fetchState });

      expect(error.statusCode).toBe(errorOrCode);
      expect(error.message).toBe('Bad Request');
    });

    it('converts string code to error', () => {
      const errorOrCode = 'setLocked';
      const $fetchState = { pending: true };

      const { error } = triggerHandleError(errorOrCode, {}, { $fetchState });

      expect(error.code).toBe('setLocked');
    });

    it('sets HTTP status code in Nuxt context', () => {
      const errorOrCode = 404;
      const $fetchState = { pending: true };

      const { wrapper } = triggerHandleError(errorOrCode, {}, { $fetchState });

      expect(wrapper.vm.$nuxt.context.res.statusCode).toBe(errorOrCode);
    });

    it('stores the error in Vuex state', () => {
      const errorOrCode = 404;

      const { wrapper } = triggerHandleError(errorOrCode);

      expect(wrapper.vm.$store.commit.calledWith('error/set', sinon.match.has('statusCode', 404))).toBe(true);
    });

    describe('when scope and status code resolve to a known code', () => {
      const errorOrCode = { statusCode: 403 };
      const options = { scope: 'gallery' };
      const $fetchState = { pending: true };

      it('decorates error with code', () => {
        const { error } = triggerHandleError(errorOrCode, options, { $fetchState });

        expect(error.code).toBe('galleryUnauthorised');
      });
    });

    describe('when status code resolves to a generic code', () => {
      const errorOrCode = { statusCode: 404 };
      const $fetchState = { pending: true };

      it('decorates error with code', () => {
        const { error } = triggerHandleError(errorOrCode, {}, { $fetchState });

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
        const errorOrCode = { statusCode: 403 };

        const { error } = triggerHandleError(errorOrCode, {}, { $fetchState });

        expect(error).toBeUndefined();
      });
    });

    describe('i18n', () => {
      const translateStub = sinon.stub().returnsArg(0);
      translateStub.withArgs('errorMessage.genericNotFound').returns({
        title: 'Not Found',
        description: 'It may have been deleted'
      });
      const $i18n = { t: translateStub };

      it('translates all strings for localised error message', () => {
        const $fetchState = { pending: true };
        const errorOrCode = { statusCode: 404 };

        const { error } = triggerHandleError(errorOrCode, {}, { $fetchState, $i18n });

        expect(error.title).toBe('errorMessage.genericNotFound.title');
        expect(error.description).toBe('errorMessage.genericNotFound.description');
      });

      describe('when error has no message, but does have a translated title', () => {
        const errorOrCode = 'genericNotFound';

        it('sets message to same as title', () => {
          const $fetchState = { pending: true };

          const { error } = triggerHandleError(errorOrCode, {}, { $fetchState, $i18n });

          expect(error.message).toBe('errorMessage.genericNotFound.title');
        });
      });
    });
  });
});
