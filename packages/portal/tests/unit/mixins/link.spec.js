import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/link';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

describe('mixins/link', () => {
  describe('methods', () => {
    describe('linkToRoute', () => {
      it('returns null for path including "://"', () => {
        const path = 'http://example.org/about';
        const query = { query: 'art' };
        const wrapper = factory();

        const linkToRoute = wrapper.vm.linkToRoute(path, query);

        expect(linkToRoute).toBeNull();
      });

      it('returns route object for path without "://"', () => {
        const path = '/about';
        const query = { query: 'art' };
        const wrapper = factory();

        const linkToRoute = wrapper.vm.linkToRoute(path, query);

        expect(linkToRoute).toEqual({
          path,
          query
        });
      });
    });

    describe('linkHrefUrl', () => {
      it('returns URL for path including "://"', () => {
        const path = 'http://example.org/about';
        const query = { query: 'art' };
        const wrapper = factory();

        const linkHrefUrl = wrapper.vm.linkHrefUrl(path, query);

        expect(linkHrefUrl).toEqual('http://example.org/about?query=art');
      });

      it('returns null for path without "://"', () => {
        const path = '/about';
        const query = { query: 'art' };
        const wrapper = factory();

        const linkHrefUrl = wrapper.vm.linkHrefUrl(path, query);

        expect(linkHrefUrl).toBeNull();
      });
    });
  });
});
