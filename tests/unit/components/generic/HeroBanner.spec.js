import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HeroBanner from '../../../../components/generic/HeroBanner.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(HeroBanner, {
  localVue,
  mocks: {
    localePath: (opts) => `/record/${opts.params.pathMatch}`,
    $t: (key) => key
  }
});

describe('components/generic/HeroBanner', () => {
  it('has a background image', () => {
    const wrapper = factory();
    wrapper.setProps({ imageUrl: 'https://example.org' });

    const hero = wrapper.find('[data-qa="hero banner"]');
    hero.attributes().style.should.contain('https://example.org');
  });

  it('has a title', () => {
    const wrapper = factory();
    wrapper.setProps({ headline: 'Welcome at Europeana' });

    const title = wrapper.find('[data-qa="hero banner"] h2');
    title.text().should.contain('Welcome at Europeana');
  });

  it('has a description', () => {
    const wrapper = factory();
    wrapper.setProps({ description: 'Explore artworks, artefacts, books, films and music' });

    const description = wrapper.find('[data-qa="hero banner"] .lead');
    description.text().should.contain('Explore artworks, artefacts, books, films and music');
  });

  it('has a link', () => {
    const wrapper = factory();
    wrapper.setProps({ identifier: '/15508/DG2014_46_12' });

    const link = wrapper.find('[data-qa="hero banner"] a');
    link.attributes().href.should.contain('15508/DG2014_46_12');
  });

  it('has an attribution', () => {
    const wrapper = factory();
    wrapper.setProps({ citation: 'Johannes Vermeer' });

    const attribution = wrapper.find('[data-qa="hero banner"] a');
    attribution.text().should.contain('Johannes Vermeer');
  });

  it('has a rights statement', () => {
    const wrapper = factory();
    wrapper.setProps({ rightsStatement: 'http://rightsstatements.org/vocab/InC/1.0/' });

    const rights = wrapper.find('[data-qa="hero banner"] a span');
    rights.text().should.contain('In Copyright');
  });

  describe('.attributionLinkDestination', () => {
    context('when url is a data.europeana.eu URI', () => {
      it('returns a route object', () => {
        const identifierSlug = '123/abc';
        const url = `http://data.europeana.eu/item/${identifierSlug}`;
        const wrapper = factory();
        wrapper.setProps({ url });

        wrapper.vm.attributionLinkDestination.should.deep.eql({
          name: 'record-all',
          params: { pathMatch: identifierSlug }
        });
      });
    });

    context('when url is not a data.europeana.eu URI', () => {
      it('returns url as-is', () => {
        const url = 'http://www.example.org/something';
        const wrapper = factory();
        wrapper.setProps({ url });

        wrapper.vm.attributionLinkDestination.should.eq(url);
      });
    });
  });

  describe('.attributionLinkText', () => {
    context('when citation is present', () => {
      it('is returned as-is', () => {
        const citation = 'Something, Someone, Somewhere';
        const wrapper = factory();
        wrapper.setProps({ citation });

        wrapper.vm.attributionLinkText.should.eq(citation);
      });
    });

    context('when citation is absent', () => {
      it('is concatenates name, creator and provider', () => {
        const name = 'Something';
        const creator = 'Someone';
        const provider = 'Somewhere';
        const wrapper = factory();
        wrapper.setProps({ name, creator, provider });

        wrapper.vm.attributionLinkText.should.eq('Something, Someone, Somewhere');
      });

      it('omits empty fields', () => {
        const name = 'Something';
        const provider = 'Somewhere';
        const wrapper = factory();
        wrapper.setProps({ name, provider });

        wrapper.vm.attributionLinkText.should.eq('Something, Somewhere');
      });
    });
  });

  describe('.recordIdentifier', () => {
    context('when identifier is present', () => {
      it('returns it', () => {
        const identifier = '/123/abc';
        const wrapper = factory();
        wrapper.setProps({ identifier });

        wrapper.vm.recordIdentifier.should.eq(identifier);
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

            wrapper.vm.recordIdentifier.should.eq(identifier);
          });
        });

        context('but is not a data.europeana.eu item URI', () => {
          it('is `null`', () => {
            const url = 'http://www.example.org/something';
            const wrapper = factory();
            wrapper.setProps({ url });

            (wrapper.vm.recordIdentifier === null).should.be.true;
          });
        });
      });

      context('and url is absent', () => {
        it('is `null`', () => {
          const wrapper = factory();

          (wrapper.vm.recordIdentifier === null).should.be.true;
        });
      });
    });
  });
});
