import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import Footer from '../../components/Footer';

test('It should render a `<footer>`.', (t) => {
  const wrapper = shallowMount(Footer);
  t.true(wrapper.is('footer'));
});
