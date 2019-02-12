import { shallowMount } from '@vue/test-utils';
import test from 'ava';

import EuropeanaCollectionsLogo from '../../components/EuropeanaCollectionsLogo';

test('It should render a `<div>`.', (t) => {
  const wrapper = shallowMount(EuropeanaCollectionsLogo);
  t.true(wrapper.is('div'));
});
