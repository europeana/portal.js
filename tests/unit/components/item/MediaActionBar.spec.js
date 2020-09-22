import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import SmartLink from '../../../../components/generic/SmartLink.vue';
import MediaActionBar from '../../../../components/item/MediaActionBar.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);
localVue.use(Vuex);
localVue.component('SmartLink', SmartLink);

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      actions: {
        viewAt: 'View at {link}',
        providedBy: 'Provided by {provider}'
      }
    }
  }
});

const store = new Vuex.Store({
  modules: {
    http: {
      namespaced: true,
      getters: {
        canonicalUrl: () => 'https://www.example.org/page'
      }
    }
  }
});

const factory = (propsData) => mount(MediaActionBar, {
  localVue,
  i18n,
  store,
  propsData,
  mocks: {
    $t: (key) => `TRANSLATED: ${key}`,
    $apis: {
      mediaProxy: {
        url: () => 'proxied'
      }
    }
  }
});

describe('components/item/MediaActionBar', () => {
  const europeanaIdentifier = '/09876/zyxwvu';
  const url = 'https://www.example.org/videos/zyxwvu.mp4';
  const rightsStatement = 'https://creativecommons.org/publicdomain/mark/1.0/';
  const useProxy = true;

  context('when rights statement is In Copyright (InC)', () => {
    const rightsStatement = 'http://rightsstatements.org/vocab/InC/1.0/';

    const wrapper = factory({
      europeanaIdentifier,
      url,
      useProxy,
      rightsStatement
    });
    const downloadLink = wrapper.find('[data-qa="download button"]');

    it('disables the download buton', () => {
      downloadLink.attributes().disabled.should.eq('disabled');
    });

    it('does not include the link to the media', () => {
      (downloadLink.attributes().href === undefined).should.be.true;
    });

    it('sets a title attribute', () => {
      downloadLink.attributes().title.should.eq('TRANSLATED: record.downloadCopyrightInfo');
    });
  });

  context('when rights statement is not In Copyright (InC)', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      useProxy
    });

    const downloadLink = wrapper.find('[data-qa="download button"]');

    it('includes a proxied media download button', () => {
      downloadLink.attributes().href.should.eq('proxied');
    });

    it('does not disable the download button', () => {
      (downloadLink.attributes().disabled === undefined).should.be.true;
    });
  });

  it('includes a rights statement as a link', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      rightsStatement,
      useProxy
    });

    const rightsStatementLink = wrapper.find('[data-qa="rights statement"]');

    rightsStatementLink.text().should.contain('Public Domain');
    rightsStatementLink.attributes().href.should.eq(rightsStatement);
  });

  it('includes a rights statement as a text', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      rightsStatement: 'CC BY-SA 4.0',
      useProxy
    });

    const rightsStatementLink = wrapper.find('[data-qa="rights statement"]');
    rightsStatementLink.text().should.contain('CC BY-SA 4.0');
  });

  it('includes a share button that shows the social share buttons', () => {
    const wrapper = factory({
      europeanaIdentifier,
      url,
      useProxy
    });

    wrapper.find('[data-qa="share buttons bar"]').isVisible().should.equal(false);

    const share = wrapper.find('[data-qa="share button"]');
    share.trigger('click');

    wrapper.find('[data-qa="share buttons bar"]').isVisible().should.equal(true);
  });

  describe('data provider attribution', () => {
    context('when isShownAt is present', () => {
      context('and provider name is in UI language', () => {
        const props = {
          europeanaIdentifier,
          isShownAt: 'http://www.example.org/page.html',
          dataProviderName: 'Data Provider',
          dataProviderLang: null,
          useProxy
        };

        it('is a non-language-tagged link', () => {
          const wrapper = factory(props);
          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const link = attribution.find('a');
          (link.attributes('lang') === undefined).should.be.true;
          link.attributes('href').should.eq(props.isShownAt);
          link.html().should.contain(props.dataProviderName);
        });
      });

      context('and provider name is not in UI language', () => {
        const props = {
          europeanaIdentifier,
          isShownAt: 'http://www.example.org/page.html',
          dataProviderName: 'Data Provider',
          dataProviderLang: 'fr',
          useProxy
        };

        it('is a language-tagged link', () => {
          const wrapper = factory(props);
          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const link = attribution.find('a');
          link.attributes('lang').should.eq(props.dataProviderLang);
          link.attributes('href').should.eq(props.isShownAt);
          link.text().should.contain(props.dataProviderName);
        });
      });
    });

    context('when isShownAt is absent', () => {
      context('and provider name is in UI language', () => {
        const props = {
          europeanaIdentifier,
          dataProviderName: 'Data Provider',
          dataProviderLang: null,
          useProxy
        };

        it('is displayed non-language-tagged', () => {
          const wrapper = factory(props);
          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const span = attribution.find('span');
          (span.attributes('lang') === undefined).should.be.true;
          span.text().should.eq(props.dataProviderName);
        });
      });

      context('and provider name is not in UI language', () => {
        const props = {
          europeanaIdentifier,
          dataProviderName: 'Data Provider',
          dataProviderLang: 'fr',
          useProxy
        };

        it('is displayed language-tagged', () => {
          const wrapper = factory(props);
          const attribution = wrapper.find('[data-qa="provider name"]');
          (attribution.attributes('lang') === undefined).should.be.true;
          const span = attribution.find('span');
          span.attributes('lang').should.eq(props.dataProviderLang);
          span.text().should.eq(props.dataProviderName);
        });
      });
    });
  });
});
