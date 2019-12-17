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
      new URLSearchParams({ view: url }).toString();
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

  describe('data provider attribution', () => {
    context('when isShownAt is present', () => {
      context('and provider name is in UI language', () => {
        const props = {
          europeanaIdentifier,
          isShownAt: 'http://www.example.org/page.html',
          dataProviderName: 'Data Provider',
          dataProviderLang: null
        };

        it('is a non-language-tagged link', () => {
          const wrapper = factory(props);

          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const link = attribution.find('a');
          link.attributes('lang' === undefined).should.be.true;
          link.attributes('href').should.eq(props.isShownAt);
          link.text().should.eq(props.dataProviderName);
        });
      });

      context('and provider name is not in UI language', () => {
        const props = {
          europeanaIdentifier,
          isShownAt: 'http://www.example.org/page.html',
          dataProviderName: 'Data Provider',
          dataProviderLang: 'fr'
        };

        it('is a language-tagged link', () => {
          const wrapper = factory(props);

          const attribution = wrapper.find('[data-qa="provider name"]');
          attribution.attributes('lang').should.eq(props.dataProviderLang);
          const link = attribution.find('a');
          link.attributes('lang').should.eq(props.dataProviderLang);
          link.attributes('href').should.eq(props.isShownAt);
          link.text().should.eq(props.dataProviderName);
        });
      });
    });

    context('when isShownAt is absent', () => {
      context('and provider name is in UI language', () => {
        const props = {
          europeanaIdentifier,
          dataProviderName: 'Data Provider',
          dataProviderLang: null
        };

        it('is displayed non-language-tagged', () => {
          const wrapper = factory(props);

          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const span = attribution.find('span');
          span.attributes('lang' === undefined).should.be.true;
          span.text().should.eq(props.dataProviderName);
        });
      });

      context('and provider name is not in UI language', () => {
        const props = {
          europeanaIdentifier,
          dataProviderName: 'Data Provider',
          dataProviderLang: 'fr'
        };

        it('is displayed language-tagged', () => {
          const wrapper = factory(props);

          const attribution = wrapper.find('[data-qa="provider name"]');
          attribution.attributes('lang').should.eq(props.dataProviderLang);
          const span = attribution.find('span');
          span.attributes('lang').should.eq(props.dataProviderLang);
          span.text().should.eq(props.dataProviderName);
        });
      });
    });
  });
});
