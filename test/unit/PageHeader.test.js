import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import test from 'ava';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

import PageHeader from '../../components/PageHeader';

test('It should render a nav element.', (t) => {
  const wrapper = shallowMount(PageHeader, {
    localVue
  });
  t.true(wrapper.is('b-navbar-stub'));
});
