import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import ContentHeader from '@/components/generic/ContentHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locale: 'en'
};

const factory = (propsData = {}) => mount(ContentHeader, {
  localVue,
  propsData,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $t: (val) => val,
    $i18n,
    $path: () => '/'
  }
});

const details = {
  title: 'This is a page',
  contextLabel: 'This is a label'
};

describe('components/generic/ContentHeader', () => {
  it('shows a label', () => {
    const wrapper = factory(details);

    wrapper.find('[data-qa="context label"]').text().should.eq(details.contextLabel);
  });
});
