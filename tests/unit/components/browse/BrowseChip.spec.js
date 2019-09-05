import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import BrowseChip from '../../../../components/browse/BrowseChip.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $route = {
  fullPath: '/entity/topic/46-musical-instrument'
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
  }
});

describe('components/browse/BrowseChip', () => {
  it('shows chips for related entities', () => {
    const wrapper = factory();
    wrapper.setData({
      relatedEntities: [
        {
          path: '46-musical-instrument',
          title: 'Musical instrument',
          type: 'topic'
        }
      ]
    });
    wrapper.findAll('[data-qa="browse chip"]').length.should.eq(1);
  });

  it('has an entity title and link', () => {
    const wrapper = factory();
    wrapper.setData({
      relatedEntities: [
        {
          path: '46-musical-instrument',
          title: 'Musical instrument',
          type: 'topic'
        }
      ]
    });

    const chip = wrapper.find('[data-qa="browse chip"]');
    chip.text().should.eq('Musical instrument');
    wrapper.vm.$route.fullPath.should.contain('46-musical-instrument');
  });
});
