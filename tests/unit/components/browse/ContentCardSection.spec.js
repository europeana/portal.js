import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCardSection from '@/components/browse/ContentCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $store = {
  state: {
    request: {
      domain: null
    }
  }
};

const factory = () => mount(ContentCardSection, {
  localVue,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $t: () => {},
    $path: () => '/',
    $store
  }
});

const dummySection = {
  headline: 'Test Headline',
  hasPartCollection: {
    items: [
      { name: 'Card one title', description: 'the first card', url: 'http://europeana.eu', image: { url: 'img/landscape.jpg' } },
      { name: 'Card two title', description: 'the second card', url: 'http://europeana.eu', image: { url: 'img/portrait.jpg' } }
    ]
  },
  moreButton: {
    url: 'http://europeana.eu',
    text: 'Show more art'
  }
};

describe('components/browse/ContentCardSection', () => {
  describe('headline', () => {
    it('is displayed as a h2', async() => {
      const wrapper = factory();

      await wrapper.setProps({ section: dummySection });

      const headline =  wrapper.find('h2[data-qa="section headline"]');

      headline.text().should.eq('Test Headline');
    });
  });

  describe('card group', () => {
    it('displays each card', async() => {
      const wrapper = factory();

      await wrapper.setProps({ section: dummySection });

      const cardGroup = wrapper.find('[data-qa="section group"]');

      cardGroup.findAll('[data-qa="content card"]').length.should.eq(2);
    });

    it('does not display unpublished or deleted cards', async() => {
      const wrapper = factory();
      dummySection.hasPartCollection.items.push(null);
      await wrapper.setProps({ section: dummySection });

      const cardGroup = wrapper.find('[data-qa="section group"]');
      cardGroup.findAll('[data-qa="content card"]').length.should.eq(2);
    });

    it('displays a button', async() => {
      const wrapper = factory();
      await wrapper.setProps({ section: dummySection });

      const moreButton = wrapper.find('[data-qa="section more button"]');
      moreButton.text().should.contain('Show more art');
      moreButton.attributes('href').should.eq('http://europeana.eu');
    });

    it('displays mini cards if a section is exclusively people', async() => {
      const wrapper = factory();
      await wrapper.setProps({
        section: {
          hasPartCollection: {
            items: [
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123', identifier: 'http://data.europeana.eu/agent/base/123', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '1234', identifier: 'http://data.europeana.eu/agent/base/1234', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '12345', identifier: 'http://data.europeana.eu/agent/base/12345', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123456', identifier: 'http://data.europeana.eu/agent/base/12346', image: 'img/landscape.jpg' }
            ]
          }
        }
      });

      wrapper.vm.isPeopleSection.should.equal(true);
    });

    it('does not display mini cards if a section is not exclusively people', async() => {
      const wrapper = factory();
      await wrapper.setProps({
        section: {
          hasPartCollection: {
            items: [
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123', identifier: 'http://data.europeana.eu/concept/base/123', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '1234', identifier: 'http://data.europeana.eu/agent/base/1234', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '12345', identifier: 'http://data.europeana.eu/agent/base/12345', image: 'img/landscape.jpg' },
              { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123456', identifier: 'http://data.europeana.eu/agent/base/12346', image: 'img/landscape.jpg' }
            ]
          }
        }
      });

      wrapper.vm.isPeopleSection.should.equal(false);
    });
  });
});
