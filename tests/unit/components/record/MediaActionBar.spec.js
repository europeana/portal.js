import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MediaActionBar from '../../../../components/record/MediaActionBar.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(MediaActionBar, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/record/MediaActionBar', () => {
  const europeanaIdentifier = '/09876/zyxwvu';
  const url = 'https://www.example.org/videos/zyxwvu.mp4';

  it('includes a proxied media download button', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url
    });

    const expectedHref = `https://proxy.europeana.eu${europeanaIdentifier}?` +
      new URLSearchParams({ url }).toString();
    const downloadLink = wrapper.find('[data-qa="download button"]');

    downloadLink.attributes().href.should.eq(expectedHref);
  });
});
