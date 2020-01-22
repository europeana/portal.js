import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchFilters from '../../../../components/search/SearchFilters.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(SearchFilters, {
  localVue,
  propsData,
  stubs: ['b-badge']
});

describe('components/search/SearchFilters', () => {
  it('shows a badge for each supplied filter', () => {
    const wrapper = factory({ filters: { TYPE: ['IMAGE', 'VIDEO'] } });

    const badges = wrapper.findAll('[data-qa="filter badge"]');
    badges.length.should.eq(2);
  });

  describe('labels', () => {
    context('when facet name is contentTier', () => {
      it('is not prefixed', () => {
        const wrapper = factory({ filters: { contentTier: ['*'] } });

        const label = wrapper.find('[facetname="contentTier"]');

        label.props('prefixed').should.be.false;
      });
    });

    context('when facet name is not contentTier', () => {
      it('is prefixed', () => {
        const wrapper = factory({ filters: { TYPE: ['IMAGE'] } });

        const label = wrapper.find('[facetname="TYPE"]');

        label.props('prefixed').should.be.true;
      });
    });
  });
});
