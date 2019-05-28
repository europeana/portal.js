import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentCard from '../../../../components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(ContentCard, {
  localVue,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/ContentCard', () => {
  it('has a description', () => {
    const wrapper = factory();
    wrapper.setProps({ description: 'The Milkmaid by Vermeer' });

    const description =  wrapper.find('[data-qa="content card"] .card-body');
    description.text().should.eq('The Milkmaid by Vermeer');
  });

  it('has a creator and institution', () => {
    const wrapper = factory();
    wrapper.setProps({ creator: 'Edvard Munch', institution: 'Munchmuseet (The Munch Museum)' });

    const description =  wrapper.find('[data-qa="content card"] .card-body');
    description.text().should.contain('Edvard Munch');
    description.text().should.contain('Munchmuseet');
  });

  it('has a link', () => {
    const wrapper = factory();
    wrapper.setProps({ url: 'https://example.org' });

    const link =  wrapper.find('[data-qa="content card"] .card-link');
    link.attributes().href.should.eq('https://example.org');
  });

  it('has an image', () => {
    const wrapper = factory();
    wrapper.setProps({ image: {
      fields: {
        file: {
          url: 'https://example.org'
        }
      }
    }
    });

    const card =  wrapper.find('[data-qa="content card"] .card-img');
    card.attributes('style').should.contain('https://example.org');
  });
});
