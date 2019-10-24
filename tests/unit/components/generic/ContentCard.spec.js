
import { createLocalVue, mount } from '@vue/test-utils';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '../../../../components/generic/SmartLink.vue';
import ContentCard from '../../../../components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

Vue.filter('truncate', () => '…');

const $store = {
  state: {
    request: {
      domain: null
    }
  }
};

const factory = () => mount(ContentCard, {
  localVue,
  mocks: {
    $t: () => {},
    $store
  }
});

describe('components/generic/ContentCard', () => {
  it('has a description', () => {
    const wrapper = factory();
    wrapper.setProps({ texts: ['The Milkmaid by Vermeer'] });

    const description =  wrapper.find('[data-qa="content card"] .card-body');
    description.text().should.eq('The Milkmaid by Vermeer');
  });

  it('has a creator and institution', () => {
    const wrapper = factory();
    wrapper.setProps({ texts: ['Edvard Munch', 'Munchmuseet (The Munch Museum)'] });

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
    wrapper.setProps({ imageUrl: 'https://example.org' });

    const card =  wrapper.find('[data-qa="content card"] .card-img');
    card.attributes('style').should.contain('https://example.org');
  });
});
