import { mount, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

const NUXT_METHODS = [
  'asyncData', 'fetch', 'head'
];

const injectNuxtMethods = (wrapper, pageOrComponent) => {
  for (const method of NUXT_METHODS) {
    wrapper.vm[method] = pageOrComponent[method];
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

// Stubs the Contentful app extension
export const fakeContentfulExtension = fields => {
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
          memo[field] = { removeValue: sinon.spy(), setValue: sinon.spy() };
          return memo;
        }, {})
      },
      dialogs: {
        openAlert: sinon.spy()
      }
    };
    callback(fakeSdk);
  };

  return {
    init: fakeInit,
    locations: {
      LOCATION_ENTRY_SIDEBAR: 'sidebar'
    }
  };
};
