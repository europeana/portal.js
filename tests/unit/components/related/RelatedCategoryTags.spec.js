import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import RelatedCategoryTags from '@/components/related/RelatedCategoryTags.vue';

const localVue = createLocalVue();

const factory = ({ propsData } = {})  => shallowMountNuxt(RelatedCategoryTags, {
  localVue,
  propsData,
  stubs: ['b-row', 'b-col', 'b-badge']
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
  });
});
