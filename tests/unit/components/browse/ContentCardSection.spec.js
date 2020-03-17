import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCardSection from '../../../../components/browse/ContentCardSection.vue';

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
    $t: () => {},
    $store
  }
});

const dummySection = {
  fields: {
    headline: 'Test Headline',
    hasPart: [
      {
        sys: { id: '123' },
        fields: { name: 'Card one title', description: 'the first card', url: 'http://europeana.eu', image: {
          fields: { file: { url: 'img/landscape.jpg' } } }
        }
      },
      {
        sys: { id: '456' },
        fields: { name: 'Card two title', description: 'the second card', url: 'http://europeana.eu', image: {
          fields: { file: { url: 'img/portrait.jpg' } } }
        }
      }
    ],
    moreButton: {
      fields: {
        url: 'http://europeana.eu',
        text: 'Show more art'
      }
    }
  },
  mocks: { $t: () => {} }
};

describe('components/browse/ContentCardSection', () => {
  describe('headline', () => {
    it('is displayed as a h2', () => {
      const wrapper = factory();

      wrapper.setProps({ section: dummySection });

      const headline =  wrapper.find('h2[data-qa="section headline"]');

      headline.text().should.eq('Test Headline');
    });
  });

  describe('card group', () => {
    it('displays each card', () => {
      const wrapper = factory();

      wrapper.setProps({ section: dummySection });

      const cardGroup = wrapper.find('[data-qa="section group"]');

      cardGroup.findAll('[data-qa="content card"]').length.should.eq(2);
    });

    it('displays a button', () => {
      const wrapper = factory();
      wrapper.setProps({ section: dummySection });

      const moreButton = wrapper.find('[data-qa="section more button"]');
      moreButton.text().should.contain('Show more art');
      moreButton.attributes('href').should.eq('http://europeana.eu');
    });
  });
});
