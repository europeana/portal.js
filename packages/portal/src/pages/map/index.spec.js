import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import MapIndexPage from './index.vue';

const localVue = createLocalVue();

const errorPluginSpy = sinon.spy();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(MapIndexPage, {
  localVue,
  mocks: {
    $error: errorPluginSpy,
    $fetchState: {
      pending: false,
      error: null
    },
    $features: {},
    $store: { state: { error: {} } },
    ...mocks
  },
  stubs: [
    'EntityOrganisationsMap',
    'ErrorMessage'
  ]
});

describe('MapIndexPage', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    describe('when organisationsMap feature is enabled', () => {
      const $features = { organisationsMap: true };

      it('displays the map component', () => {
        const wrapper = factory({ mocks: { $features } });

        expect(errorPluginSpy.called).toBe(false);

        const entityOrganisationsMapStub = wrapper.find('entityorganisationsmap-stub');

        expect(entityOrganisationsMapStub.isVisible()).toBe(true);
      });
    });

    describe('when organisationsMap feature is not enabled', () => {
      const $features = { organisationsMap: false };
      const $store = { state: { error: { error: { message: 'Not Found' } } } };

      it('displays an error message', () => {
        const wrapper = factory({ mocks: { $features, $store } });

        expect(errorPluginSpy.calledWith(404, { scope: 'page' })).toBe(true);

        const errorMessageStub = wrapper.find('errormessage-stub');

        expect(errorMessageStub.isVisible()).toBe(true);
      });
    });
  });
});
