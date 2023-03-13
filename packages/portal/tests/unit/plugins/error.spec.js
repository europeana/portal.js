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
      ...mocks
    }
  });

  return wrapper;
};

describe('@/plugins/error', () => {
  describe('handleError', () => {
    it('converts number to the equivalent HTTP error', () => {
      const errorOrCode = 400;
      const wrapper = factory({
        mocks: { $error: errorPlugin.handleError }
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

    describe('when scope and status code do not resolve to a known code', () => {
      const errorOrCode = { statusCode: 400 };

      it('throws the error', () => {
        const wrapper = factory({
          mocks: { $error: errorPlugin.handleError }
        });

        let error;
        try {
          wrapper.vm.$error(errorOrCode);
        } catch (e) {
          error = e;
        }

        expect(error).toBe(errorOrCode);
      });
    });

    describe('when Nuxt fetch state is not pending', () => {
      const $fetchState = { pending: false };

      it('emits "show-error-modal" event on Vue root, with error as arg', () => {
        const wrapper = factory({
          mocks: { $error: errorPlugin.handleError, $fetchState }
        });
        sinon.spy(wrapper.vm.$root, '$emit');
        const error = { statusCode: 403 };

        wrapper.vm.$error(error);

        expect(wrapper.vm.$root.$emit.calledWith(
          'show-error-modal', error
        )).toBe(true);
      });
    });
  });
});
