import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCard from '../../../../components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ContentCard, {
  localVue
});

describe('ContentCard', () => {
  it('includes a "Read more" link', () => {
    const wrapper = factory();

    const link = wrapper.find('.card-link');
    link.text().should.include('Read more');
  });
});
