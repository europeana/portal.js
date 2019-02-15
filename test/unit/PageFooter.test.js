import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import PageFooter from '../../components/PageFooter';

test('It should render a `<footer>`.', (t) => {
  const wrapper = shallowMount(PageFooter);
  t.true(wrapper.is('footer'));
});
