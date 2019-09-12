import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';

import SearchResults from '../../../../components/search/SearchResults.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
const router = new VueRouter();

const factory = (propsData = {}) => mount(SearchResults, {
  localVue,
  router,
  propsData,
  mocks: {
    $t: (key) => key,
    localePath: (opts) => opts
  }
});

describe('components/search/SearchResults', () => {
  context('with `error` prop', () => {
    it('displays the message', () => {
      const errorMessage = 'Something went very wrong';
      const wrapper = factory({ error: errorMessage });

      const errorNotice =  wrapper.find('[data-qa="error notice"]');

      errorNotice.text().should.include(errorMessage);
    });
  });

  describe('contentTierActiveState', () => {
    context('when contentTier facet includes "*"', () => {
      it('is `true`', () => {
        const wrapper = factory({
          selectedFacets: {
            contentTier: ['*']
          }
        });

        wrapper.vm.contentTierActiveState.should.be.true;
      });
    });

    context('when contentTier facet does not include "*"', () => {
      it('is `false`', () => {
        const wrapper = factory({
          selectedFacets: {
            contentTier: ['1 OR 2 OR 3 OR 4']
          }
        });

        wrapper.vm.contentTierActiveState.should.be.false;
      });
    });
  });

  describe('orderedFacets', () => {
    const wrapper = factory({
      facets: [
        { name: 'COUNTRY' },
        { name: 'RIGHTS' },
        { name: 'DATA_PROVIDER' },
        { name: 'REUSABILITY' },
        { name: 'TYPE' }
      ]
    });

    it('injects `theme` pseudo-facet first', () => {
      wrapper.vm.orderedFacets[0].name.should.eq('THEME');
    });

    it('follows with ordered default facets from search plugin', () => {
      wrapper.vm.orderedFacets[1].name.should.eq('TYPE');
      wrapper.vm.orderedFacets[2].name.should.eq('REUSABILITY');
      wrapper.vm.orderedFacets[3].name.should.eq('COUNTRY');
    });

    it('ends with any other facets in their original order', () => {
      wrapper.vm.orderedFacets[4].name.should.eq('RIGHTS');
      wrapper.vm.orderedFacets[5].name.should.eq('DATA_PROVIDER');
    });
  });
});
