import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import RelatedCategoryTags from '@/components/related/RelatedCategoryTags.vue';

const localVue = createLocalVue();

const factory = ({ propsData } = {})  => shallowMountNuxt(RelatedCategoryTags, {
  localVue,
  propsData,
  stubs: ['b-row', 'b-col', 'b-badge'],
  mocks: {
    $path: (opts) => opts
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
      const tags = [{ name: 'red tape' }, { name: 'white wash' }];

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
          expect(link.query).toBe(undefined);
        });

        it('removes a tag from the url', () => {
          const wrapper = factory({ propsData: { tags, selected: ['red tape', 'blue tape'] } });
          const link = wrapper.vm.badgeLink('blue tape');
          expect(link.query.tags).toBe('red tape');
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
