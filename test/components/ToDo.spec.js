import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import ToDo from '../../components/ContentCard';

test('It should render an `<p>`.', (t) => {
  const wrapper = shallowMount(ToDo);

  t.true(wrapper.is('b-card'));
});
