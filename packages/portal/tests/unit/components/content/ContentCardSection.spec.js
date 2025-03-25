import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCardSection from '@/components/content/ContentCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $store = {
  state: {
    request: {
      domain: null
    }
  }
};

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

const factory = (section) => mount(ContentCardSection, {
  attachTo: document.body,
  localVue,
  propsData: {
    section: section || dummySection
  },
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $t: () => {},
    localePath: () => '/',
    $store
  }
});

describe('components/content/ContentCardSection', () => {
  describe('headline', () => {
    it('is displayed as a h2', async() => {
      const wrapper = factory(dummySection);

      const headline =  wrapper.find('h2[data-qa="section headline"]');

      expect(headline.text()).toBe('Test Headline');
    });
  });

  describe('card group', () => {
    it('displays each card', async() => {
      const wrapper = factory();

      const cardGroup = wrapper.find('[data-qa="section group"]');

      expect(cardGroup.findAll('[data-qa="content card"]').length).toBe(2);
    });

    it('does not display depublished or deleted cards', async() => {
      const dummySectionPlusNull = {
        hasPartCollection: {
          items: [
            { name: 'Card one title', description: 'the first card', url: 'http://europeana.eu', image: { url: 'img/landscape.jpg' } },
            { name: 'Card two title', description: 'the second card', url: 'http://europeana.eu', image: { url: 'img/portrait.jpg' } },
            null
          ]
        }
      };
      const wrapper = factory(dummySectionPlusNull);

      const cardGroup = wrapper.find('[data-qa="section group"]');
      expect(cardGroup.findAll('[data-qa="content card"]').length).toBe(2);
    });

    it('displays a button', async() => {
      const wrapper = factory();

      const moreButton = wrapper.find('[data-qa="section more button"]');
      expect(moreButton.text()).toContain('Show more art');
      expect(moreButton.attributes('href')).toBe('http://europeana.eu');
    });

    it('displays mini cards if a section is exclusively people', async() => {
      const wrapper = factory({
        hasPartCollection: {
          items: [
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123', identifier: 'http://data.europeana.eu/agent/123', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '1234', identifier: 'http://data.europeana.eu/agent/1234', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '12345', identifier: 'http://data.europeana.eu/agent/12345', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123456', identifier: 'http://data.europeana.eu/agent/12346', image: 'img/landscape.jpg' }
          ]
        }
      });

      expect(wrapper.vm.isPeopleSection).toBe(true);
    });

    it('does not display mini cards if a section is not exclusively people', async() => {
      const wrapper = factory({
        hasPartCollection: {
          items: [
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123', identifier: 'http://data.europeana.eu/concept/123', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '1234', identifier: 'http://data.europeana.eu/agent/1234', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '12345', identifier: 'http://data.europeana.eu/agent/12345', image: 'img/landscape.jpg' },
            { __typename: 'AutomatedEntityCard', name: 'Card one title', slug: '123456', identifier: 'http://data.europeana.eu/agent/12346', image: 'img/landscape.jpg' }
          ]
        }
      });

      expect(wrapper.vm.isPeopleSection).toBe(false);
    });
  });
});
