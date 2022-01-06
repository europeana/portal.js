import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import nock from 'nock';
import sinon from 'sinon';
import ItemEmbedCode from '@/components/item/ItemEmbedCode.vue';

const OEMBED_BASE_URL = 'https://oembedjs.europeana.eu';
const identifier = '/123/abc';
const html = '<iframe src=""></iframe>';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mountNuxt(ItemEmbedCode, {
  localVue,
  propsData: {
    identifier
  },
  mocks: {
    $t: key => key
  }
});

describe('components/item/ItemEmbedCode', () => {
  describe('fetch()', () => {
    beforeEach(() => {
      nock(OEMBED_BASE_URL)
        .get('/')
        .query(query => {
          return query.url === 'http://data.europeana.eu/item/123/abc' && query.format === 'json';
        })
        .reply(200, { html });
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('sends an oEmbed request to the Europeana oEmbed provider', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(nock.isDone()).toBe(true);
    });

    it('stores html from response body on component embedHtml property', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.embedHtml).toBe(html);
    });
  });

  describe('when response includes "html" property', () => {
    document.execCommand = sinon.spy();

    const wrapper = factory();
    wrapper.setData({
      embedHtml: html
    });

    it('is shown in a textarea', () => {
      expect(wrapper.find('#share-embed').element.value).toBe(html);
    });

    describe('when textarea is clicked', () => {
      it('copies the embed code to the clipboard', async() => {
        await wrapper.find('#share-embed').trigger('click');

        expect(document.execCommand.calledWith('copy')).toBe(true);
      });

      it('shows a notification message', async() => {
        await wrapper.find('#share-embed').trigger('click');

        wrapper.find('[data-qa="share embed copied notice"]').isVisible().should;
      });
    });
  });

  describe('when response does not include "html" property', () => {
    it('does not render form for embed', () => {
      const wrapper = factory();

      expect(wrapper.find('[data-qa="share embed"]').exists()).toBe(false);
    });
  });
});
