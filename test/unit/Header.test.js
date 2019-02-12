import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import Header from '../../components/Header';

test('It should render a `<header>`.', (t) => {
  const wrapper = shallowMount(Header);
  t.true(wrapper.is('header'));
});
