import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MediaActionBar from '../../../../components/record/MediaActionBar.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(MediaActionBar, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/record/MediaActionBar', () => {
  const europeanaIdentifier = '/09876/zyxwvu';
  const url = 'https://www.example.org/videos/zyxwvu.mp4';
  const rightsStatementUrl = 'https://creativecommons.org/publicdomain/mark/1.0/';

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

  it('includes a rights statement', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      rightsStatementUrl
    });

    const rightsStatementLink = wrapper.find('[data-qa="rights statement link"]');
    rightsStatementLink.text().should.contain('Public Domain');
  });
});
