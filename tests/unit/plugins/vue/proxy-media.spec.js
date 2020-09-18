import { createLocalVue, shallowMount } from '@vue/test-utils';

import plugin from '../../../../plugins/vue/proxy-media';

const component = {
  template: '<div></div>'
};

const localVue = createLocalVue();
localVue.use(plugin);

const factory = () => shallowMount(component, {
  localVue
});

describe('plugins/vue/proxy-media', () => {
  it('adds $proxyMedia() to Vue', () => {
    const wrapper = factory();

    (typeof wrapper.vm.$proxyMedia).should.eq('function');
  });

  describe('$proxyMedia()', () => {
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('uses origin https://proxy.europeana.eu', () => {
      const wrapper = factory();

      const proxyUrl = new URL(wrapper.vm.$proxyMedia(mediaUrl, europeanaId));

      proxyUrl.origin.should.eq('https://proxy.europeana.eu');
    });

    it('uses europeanaId as path', () => {
      const wrapper = factory();

      const proxyUrl = new URL(wrapper.vm.$proxyMedia(mediaUrl, europeanaId));

      proxyUrl.pathname.should.eq(europeanaId);
    });

    it('uses web resource URI as view param', () => {
      const wrapper = factory();

      const proxyUrl = new URL(wrapper.vm.$proxyMedia(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('view').should.eq(mediaUrl);
    });

    it('uses store Record API origin as api_url param', () => {
      const wrapper = factory();

      const proxyUrl = new URL(wrapper.vm.$proxyMedia(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('api_url').should.eq('https://api.europeana.eu/api');
    });

    it('sets additional params from final arg', () => {
      const wrapper = factory();

      const proxyUrl = new URL(wrapper.vm.$proxyMedia(mediaUrl, europeanaId, { disposition: 'inline' }));

      proxyUrl.searchParams.get('disposition').should.eq('inline');
    });
  });
});
