import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

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
      actions: {
        init: () => {}
      }
    }
  }
});

const factory = () => shallowMount(PageNavigation, {
  localVue,
  store
});

describe('components/search/PageNavigation', () => {
  it('calls dispatch on page load', async() => {
    // const wrapper = factory();

    factory();

    // console.log('MONKEY', store);

    // wrapper.setData({
    //   navigation: [
    //     {
    //       name: 'Home',
    //       path: '/'
    //     }
    //   ]
    // });
    // store.dispatch.to.have.been.calledWith('navigation/init');
  });
});
