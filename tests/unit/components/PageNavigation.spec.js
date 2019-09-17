import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import PageNavigation from '../../../components/PageNavigation.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);


const store = new Vuex.Store({
  modules: {
    i18n: {
      state: {
        locale: 'en'
      }
    },
    navigation: {
      state: {
        data: [
          {
            name: 'Home',
            path: 'home'
          }
        ]
      }
    }
  }
});

store.dispatch = sinon.stub();

const factory = () => mount(PageNavigation, {
  localVue,
  store,
  mocks: {
    localePath: code => window.location.href + code
  }
});

describe('components/search/PageNavigation', () => {
  it('calls dispatch on page load', async() => {
    factory();

    sinon.assert.calledWith(store.dispatch);
  });

  it('retrieves the correct navigation data', () => {
    const wrapper = factory();
    const links =  wrapper.findAll('[data-qa="main navigation link"]');

    links.at(0).text().should.eq('Home');
  });
});
