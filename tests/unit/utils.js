import { mount, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

const NUXT_METHODS = [
  'asyncData', 'fetch', 'head', 'beforeRouteEnter', 'watch', 'mounted'
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

const fakeContentfulExtensionField = () => ({
  getValue: sinon.stub(),
  removeValue: sinon.stub(),
  setValue: sinon.stub()
});

// Stubs the Contentful app extension
export const fakeContentfulExtension = (fields = []) => {
  const fakeInit = callback => {
    const fakeSdk = {
      location: {
        is: (location) => location === 'sidebar'
      },
      window: {
        startAutoResizer: () => {}
      },
      entry: {
        fields: fields.reduce((memo, field) => {
          memo[field] = fakeContentfulExtensionField();
          return memo;
        }, {})
      },
      field: fakeContentfulExtensionField(),
      dialogs: {
        openAlert: sinon.spy(),
        openPrompt: sinon.spy()
      },
      space: {
        createAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        processAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        waitUntilAssetProcessed: sinon.stub().resolves({ sys: { id: 'abcdef' } }),
        publishAsset: sinon.stub().resolves({ sys: { id: 'abcdef' } })
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
