import { mount, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

const NUXT_METHODS = [
  'asyncData', 'fetch', 'head', 'beforeRouteEnter', 'beforeDestroy', 'watch', 'mounted', 'middleware', 'layout'
];

const injectNuxtMethods = (wrapper, pageOrComponent) => {
  for (const method of NUXT_METHODS) {
    wrapper.vm[method] = pageOrComponent[method];
    wrapper.vm['$fetch'] = pageOrComponent.fetch;
  }
  return wrapper;
};

export const shallowMountNuxt = (pageOrComponent, options = {}) => {
  const wrapper = shallowMount(pageOrComponent, options);
  return injectNuxtMethods(wrapper, pageOrComponent);
};

export const mountNuxt = (pageOrComponent, options = {}) => {
  const wrapper = mount(pageOrComponent, options);
  return injectNuxtMethods(wrapper, pageOrComponent);
};

const fakeContentfulExtensionField = (returnVal) => ({
  getValue: sinon.stub().returns(returnVal),
  removeValue: sinon.stub(),
  setValue: sinon.stub(),
  onValueChanged: sinon.stub()
});

// Stubs the Contentful app extension
export const fakeContentfulExtension = ({ entryFields = [], fieldReturnValue = undefined, location = 'sidebar' } = {}) => {
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
        }, {})
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
        getEntries: sinon.stub().resolves({ items: [] })
      }
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
