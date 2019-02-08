import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import ContentCard from '../../components/ContentCard';

test('It should render an `<b-card>`.', (t) => {
  const wrapper = shallowMount(ContentCard);
  t.true(wrapper.is('b-card'));
});
