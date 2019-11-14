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
  const rightsStatement = 'https://creativecommons.org/publicdomain/mark/1.0/';

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

  it('includes a rights statement as a link', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      rightsStatement
    });

    const rightsStatementLink = wrapper.find('[data-qa="rights statement"]');

    rightsStatementLink.text().should.contain('Public Domain');
    rightsStatementLink.attributes().href.should.eq(rightsStatement);
  });

  it('includes a rights statement as a text', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      rightsStatement: 'CC BY-SA 4.0'
    });

    const rightsStatementLink = wrapper.find('[data-qa="rights statement"]');
    rightsStatementLink.text().should.contain('CC BY-SA 4.0');
  });
});
