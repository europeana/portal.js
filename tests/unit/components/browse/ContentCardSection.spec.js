import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCardSection from '../../../../components/browse/ContentCardSection.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(ContentCardSection, {
  localVue
});

describe('components/browse/ContentCardSection', () => {
  describe('headline', () => {
    it('is displayed as a h2', () => {
      const wrapper = factory();
      const props = {
        section: {
          fields: {
            headline: 'Test Headline'
          }
        }
      };

      wrapper.setProps(props);

      const headline =  wrapper.find('h2[data-qa="section headline"]');

      headline.text().should.eq('Test Headline');
    });
  });

  describe('card group', () => {
    it('displays each card', () => {
      const wrapper = factory();

      const section = {
        fields: {
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
          ]
        }
      };

      wrapper.setProps({ section: section });

      const cardGroup = wrapper.find('[data-qa="section group"]');

      console.log(cardGroup.html());
      console.log(cardGroup.findAll('[data-qa="content card"]'));
      cardGroup.findAll('[data-qa="content card"]').length.should.eq(2);
    });
  });
});
