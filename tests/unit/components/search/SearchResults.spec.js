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

  describe('qf', () => {
    const wrapper = factory({
      selectedFacets: {
        'THEME': 'art',
        'REUSABILITY': ['open'],
        'TYPE': ['IMAGE', 'SOUND'],
        'contentTier': ['4']
      }
    });

    it('omits THEME', () => {
      wrapper.vm.qf.should.not.include('THEME:art');
      wrapper.vm.qf.should.not.include('THEME:"art"');
    });

    it('omits REUSABILITY', () => {
      wrapper.vm.qf.should.not.include('REUSABILITY:open');
      wrapper.vm.qf.should.not.include('REUSABILITY:"open"');
    });

    context('for default facets from search plugin', () => {
      it('includes fielded and quoted queries for each value', () => {
        wrapper.vm.qf.should.include('TYPE:"IMAGE"');
        wrapper.vm.qf.should.include('TYPE:"SOUND"');
      });
    });

    context('for any other facetes', () => {
      it('includes fielded but unquoted queries for each value', () => {
        wrapper.vm.qf.should.include('contentTier:4');
      });
    });
  });

  describe('reusability', () => {
    context('when REUSABILITY facet is not set', () => {
      const wrapper = factory({
        selectedFacets: {
          'TYPE': ['IMAGE', 'SOUND']
        }
      });

      it('is `undefined`', () => {
        (typeof wrapper.vm.reusability).should.eql('undefined');
      });
    });

    context('when REUSABILITY facet is set', () => {
      const wrapper = factory({
        selectedFacets: {
          'REUSABILITY': ['open', 'permission'],
          'TYPE': ['IMAGE', 'SOUND']
        }
      });

      it('is its value joined with ","', () => {
        wrapper.vm.reusability.should.eq('open,permission');
      });
    });
  });

  describe('theme', () => {
    context('when THEME facet is not set', () => {
      const wrapper = factory({
        selectedFacets: {
          'TYPE': ['IMAGE', 'SOUND']
        }
      });

      it('is `undefined`', () => {
        (typeof wrapper.vm.theme).should.eql('undefined');
      });
    });

    context('when THEME facet is set', () => {
      const wrapper = factory({
        selectedFacets: {
          'THEME': 'migration',
          'TYPE': ['IMAGE', 'SOUND']
        }
      });

      it('is its value', () => {
        wrapper.vm.theme.should.eq('migration');
      });
    });
  });
});
