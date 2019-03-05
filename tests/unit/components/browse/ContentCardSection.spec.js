import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCardSection from '../../../../components/browse/ContentCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(ContentCardSection, {
  localVue
});

const section = {
  fields: {
    headline: 'Test Headline',
    text: 'Test description text',
    hasPart: [
      {
        sys: {
          id: '123'
        },
        fields: {
          name: 'Card one title',
          description: 'the first card',
          image: {
            fields: {
              file: {
                url: 'img/landscape.jpg'
              }
            }
          },
          url: 'http://europeana.eu'
        }
      },
      {
        sys: {
          id: '456'
        },
        fields: {
          name: 'Card two title',
          description: 'the second card',
          image: {
            fields: {
              file: {
                url: 'img/portrait.jpg'
              }
            }
          },
          url: 'http://europeana.eu'
        }
      }
    ]
  }
};

describe('components/browse/ContentCardSection', () => {
  describe('headline', () => {
    it('is displayed as a h2', () => {
      const wrapper = factory();

      wrapper.setProps({ section: section });

      const headline =  wrapper.find('h2[data-qa="section headline"]');

      headline.text().should.should.eq('Test headline');
    });
  });

  describe('card group', () => {
    it('displays each card', () => {
      const wrapper = factory();

      wrapper.setProps({ section: section });

      const cardGroup = wrapper.find('[data-qa="section group"]');

      cardGroup.elements.count.should.should.eq(2);
    });
  });
});
