import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BrowseChip from '../../../../components/browse/BrowseChip.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $route = {
  fullPath: '/entity/topic/94-architecture'
};

const $i18n = {
  locales: [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ],
  locale: 'en'
};

const factory = () => shallowMount(BrowseChip, {
  localVue,
  mocks: {
    $route,
    $t: () => {},
    $i18n,
    localePath: () => {}
  },
  propsData: {
    linkTo: '/'
  }
});

describe('components/browse/BrowseChip', () => {
  it('shows chips for related entities', () => {
    const wrapper = factory();
    wrapper.setProps({ type: 'topic', path: '94-architecture', title: 'Architecture' });

    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(1);
  });

  it('has an entity title and link', () => {
    const wrapper = factory();
    wrapper.setProps({ type: 'topic', path: '94-architecture', title: 'Architecture' });

    const chip = wrapper.find('[data-qa="browse chip"]');
    chip.text().should.eq('Architecture');
    wrapper.vm.$route.fullPath.should.contain('94-architecture');
  });

  it('does not show chips if no related entities found', () => {
    const wrapper = factory();

    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(0);
  });
});
