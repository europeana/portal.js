import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import test from 'ava';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

import ContentCard from '../../components/ContentCard';

test('It should render a Read more link.', (t) => {
  const wrapper = shallowMount(ContentCard, {
    localVue
  });
  const link = wrapper.find('.card-link').text();
  t.true(link.includes('Read more'));
});
