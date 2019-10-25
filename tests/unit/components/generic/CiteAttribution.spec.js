import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import CiteAttribution from '../../../../components/generic/CiteAttribution.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const requiredProps = {
  rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
};

const factory = () => mount(CiteAttribution, {
  localVue,
  mocks: {
    localePath: (opts) => opts,
    $t: (key) => key
  },
  propsData: requiredProps
});

describe('components/generic/CiteAttribution', () => {
  it('has a link', () => {
    const url = 'http://www.example.org/something';
    const wrapper = factory();
    wrapper.setProps({ url });

    const link = wrapper.find('cite a');
    link.attributes().href.should.eq(url);
  });

  it('has an attribution', () => {
    const wrapper = factory();
    wrapper.setProps({ citation: 'Johannes Vermeer' });

    const attribution = wrapper.find('cite a');
    attribution.text().should.contain('Johannes Vermeer');
  });

  it('has a rights statement', () => {
    const wrapper = factory();
    wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

    const rights = wrapper.find('cite a span');
    rights.text().should.contain('In Copyright');
  });

  describe('.linkDestination', () => {
    context('when url is a data.europeana.eu URI', () => {
      it('returns a route object', () => {
        const identifierSlug = '123/abc';
        const url = `http://data.europeana.eu/item/${identifierSlug}`;
        const wrapper = factory();
        wrapper.setProps({ url });

        wrapper.vm.linkDestination.should.deep.eql({
          name: 'item-all',
          params: { pathMatch: identifierSlug }
        });
      });
    });

    context('when url is not a data.europeana.eu URI', () => {
      it('returns url as-is', () => {
        const url = 'http://www.example.org/something';
        const wrapper = factory();
        wrapper.setProps({ url });

        wrapper.vm.linkDestination.should.eq(url);
      });
    });
  });

  describe('.linkText', () => {
    context('when citation is present', () => {
      it('is returned as-is', () => {
        const citation = 'Something, Someone, Somewhere';
        const wrapper = factory();
        wrapper.setProps({ citation });

        wrapper.vm.linkText.should.eq(citation);
      });
    });

    context('when citation is absent', () => {
      it('is concatenates name, creator and provider', () => {
        const name = 'Something';
        const creator = 'Someone';
        const provider = 'Somewhere';
        const wrapper = factory();
        wrapper.setProps({ name, creator, provider });

        wrapper.vm.linkText.should.eq('Something, Someone, Somewhere');
      });

      it('omits empty fields', () => {
        const name = 'Something';
        const provider = 'Somewhere';
        const wrapper = factory();
        wrapper.setProps({ name, provider });

        wrapper.vm.linkText.should.eq('Something, Somewhere');
      });
    });
  });

  describe('.europeanaIdentifier', () => {
    context('when identifier is present', () => {
      it('returns it', () => {
        const identifier = '/123/abc';
        const wrapper = factory();
        wrapper.setProps({ identifier });

        wrapper.vm.europeanaIdentifier.should.eq(identifier);
      });
    });

    context('when identifier is absent', () => {
      context('when url is present', () => {
        context('and is a data.europeana.eu item URI', () => {
          it('extracts identifier from it', () => {
            const identifier = '/123/abc';
            const url = `http://data.europeana.eu/item${identifier}`;
            const wrapper = factory();
            wrapper.setProps({ url });

            wrapper.vm.europeanaIdentifier.should.eq(identifier);
          });
        });

        context('but is not a data.europeana.eu item URI', () => {
          it('is `null`', () => {
            const url = 'http://www.example.org/something';
            const wrapper = factory();
            wrapper.setProps({ url });

            (wrapper.vm.europeanaIdentifier === null).should.be.true;
          });
        });
      });

      context('and url is absent', () => {
        it('is `null`', () => {
          const wrapper = factory();

          (wrapper.vm.europeanaIdentifier === null).should.be.true;
        });
      });
    });
  });
});
