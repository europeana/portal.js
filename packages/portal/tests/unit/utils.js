import { mount, shallowMount } from '@vue/test-utils';
import { ref } from 'vue';
import sinon from 'sinon';

const NUXT_METHODS = [
  'asyncData', 'head', 'beforeRouteEnter', 'beforeDestroy', 'watch', 'mounted', 'middleware', 'layout'
];

const injectNuxtMethods = (wrapper, pageOrComponent) => {
  for (const method of NUXT_METHODS) {
    wrapper.vm[method] = pageOrComponent[method];
  }

  wrapper.vm.fetch = async function() {
    try {
      wrapper.vm['$fetchState'].pending = true;
      await pageOrComponent.fetch.bind(wrapper.vm)();
    } catch (e) {
      wrapper.vm['$fetchState'].error = e;
    } finally {
      wrapper.vm['$fetchState'].pending = false;
    }
  };
  wrapper.vm['$fetch'] = wrapper.vm.fetch;

  return wrapper;
};

const mountOptionsWithFetchState = (options) => {
  options.mocks ||= {};
  options.mocks.$fetchState ||= { error: ref(null), pending: ref(false) };
  return options;
};

export const shallowMountNuxt = (pageOrComponent, options = {}) => {
  const wrapper = shallowMount(pageOrComponent, mountOptionsWithFetchState(options));
  return injectNuxtMethods(wrapper, pageOrComponent);
};

export const mountNuxt = (pageOrComponent, options = {}) => {
  const wrapper = mount(pageOrComponent, mountOptionsWithFetchState(options));
  return injectNuxtMethods(wrapper, pageOrComponent);
};

const fakeContentfulExtensionField = (returnVal) => ({
  getValue: sinon.stub().returns(returnVal),
  removeValue: sinon.stub(),
  setInvalid: sinon.stub(),
  setValue: sinon.stub(),
  onValueChanged: sinon.stub()
});

// Stubs the Contentful app extension
export const fakeContentfulExtension = ({ entryFields = [], fieldReturnValue = undefined, location = 'sidebar', contentType, parameters } = {}) => {
  const fakeInit = callback => {
    const fakeSdk = {
      location: {
        is: (val) => val === location
      },
      window: {
        startAutoResizer: sinon.spy()
      },
      entry: {
        fields: entryFields.reduce((memo, field) => {
          memo[field] = fakeContentfulExtensionField();
          return memo;
        }, {}),
        getSys: () => ({ id: 'entry001' })
      },
      field: fakeContentfulExtensionField(fieldReturnValue),
      dialogs: {
        openAlert: sinon.spy(),
        openPrompt: sinon.spy()
      },
      space: {
        createAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        processAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        waitUntilAssetProcessed: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        publishAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        getEntries: sinon.stub().resolves({ items: [] }),
        getContentTypes: sinon.stub().resolves({ items: [{ fields: entryFields.map((field) => ({ id: field.id })), sys: { id: contentType.sys.id } }] })
      },
      contentType,
      parameters
    };
    callback(fakeSdk);
  };

  return {
    init: fakeInit,
    locations: {
      LOCATION_ENTRY_FIELD: 'field',
      LOCATION_ENTRY_SIDEBAR: 'sidebar'
    }
  };
};
