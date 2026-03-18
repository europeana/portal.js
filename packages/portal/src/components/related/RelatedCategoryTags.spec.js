import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import RelatedCategoryTags from '@/components/related/RelatedCategoryTags.vue';

const localVue = createLocalVue();

const factory = ({ propsData, mocks } = {})  => shallowMountNuxt(RelatedCategoryTags, {
  localVue,
  propsData,
  stubs: ['b-row', 'b-col', 'b-badge'],
  mocks: {
    localePath: (opts) => opts,
    $route: {},
    $t: (key) => key,
    $matomo: { trackEvent: sinon.spy() },
    ...mocks
  }
});

describe('components/related/RelatedCategoryTags', () => {
  describe('template', () => {
    describe('when there are no tags', () => {
      const tags = [];

      it('does not display the tag icon', () => {
        const wrapper = factory({ propsData: { tags } });

        const tagIcon = wrapper.find('.icon-ic-tag');

        expect(tagIcon.exists()).toBe(false);
      });
    });

    describe('when there are tags', () => {
      const tags = [
        { identifier: 'red-tape', name: 'red tape' },
        { identifier: 'white-wash', name: 'white wash' }
      ];

      it('displays the tag icon', () => {
        const wrapper = factory({ propsData: { tags } });

        const tagIcon = wrapper.find('.icon-ic-tag');

        expect(tagIcon.exists()).toBe(true);
      });

      it('displays a badge for each tag', () => {
        const wrapper = factory({ propsData: { tags } });

        const badges = wrapper.findAll('b-badge-stub');

        expect(badges.length).toBe(tags.length);
      });

      it('excludes null tags', () => {
        const wrapper = factory({ propsData: { tags: tags.concat([null]) } });

        const badges = wrapper.findAll('b-badge-stub');

        expect(badges.length).toBe(tags.length);
      });

      describe('clicking the badge', () => {
        it('tracks selecting tag', () => {
          const wrapper = factory({ propsData: { tags } });

          const badge = wrapper.find('b-badge-stub');

          badge.trigger('click.native');

          expect(wrapper.vm.$matomo.trackEvent.calledWith('Tags', 'Select tag', 'red-tape')).toBe(true);
        });

        it('tracks deselecting tag', () => {
          const wrapper = factory({ propsData: { tags, selected: [tags[0].identifier] } });

          const badge = wrapper.find('b-badge-stub');

          badge.trigger('click.native');

          expect(wrapper.vm.$matomo.trackEvent.calledWith('Tags', 'Deselect tag', 'red-tape')).toBe(true);
        });
      });
    });

    describe('methods', () => {
      const tags = [{ name: 'red tape' }, { name: 'white wash' }];
      const selected = ['red tape'];

      describe('badgeLink', () => {
        it('adds the tag to the url', () => {
          const wrapper = factory({ propsData: { tags } });
          const link = wrapper.vm.badgeLink('red tape');
          expect(link.query.tags).toBe('red tape');
        });

        it('adds another tag to the url', () => {
          const wrapper = factory({ propsData: { tags, selected } });
          const link = wrapper.vm.badgeLink('blue tape');
          expect(link.query.tags).toBe('red tape,blue tape');
        });

        it('removes the only tag from the url', () => {
          const wrapper = factory({ propsData: { tags, selected } });
          const link = wrapper.vm.badgeLink('red tape');
          expect(link.query.tags).toBe(undefined);
        });

        it('removes a tag from the url', () => {
          const wrapper = factory({ propsData: { tags, selected: ['red tape', 'blue tape'] } });
          const link = wrapper.vm.badgeLink('blue tape');
          expect(link.query.tags).toBe('red tape');
        });

        describe('when on page beyond the first page', () => {
          it('resets the page query', () => {
            const wrapper = factory({ propsData: { tags }, mocks: { $route: { query: { page: 2 } } } });

            const link = wrapper.vm.badgeLink('red tape');
            expect(link.query.page).toBe(undefined);
          });
        });
      });

      describe('isActive', () => {
        it('returns true when there is an active tag', () => {
          const wrapper = factory({ propsData: { tags, selected } });
          const active = wrapper.vm.isActive('red tape');

          expect(active).toBe(true);
        });
        it('returns false when there is not an active tag', () => {
          const wrapper = factory({ propsData: { tags } });
          const active = wrapper.vm.isActive('red tape');

          expect(active).toBe(false);
        });
      });
    });
  });
});
