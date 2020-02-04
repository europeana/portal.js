import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '../../../../components/generic/SmartLink.vue';
import ContentCard from '../../../../components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

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
    $i18n: {
      locale: 'en'
    },
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

    const card =  wrapper.find('[data-qa="content card"] .card-img img');
    card.should.exist;
  });

  it('has an optimised image', () => {
    const wrapper = factory();
    wrapper.setProps({ imageUrl: '//images.ctfassets.net/example/example.jpg', imageContentType: 'image/jpeg' });

    wrapper.vm.optimisedImageUrl.should.contain('fm=jpg&fl=progressive&q=50');
  });

  it('has an optimised image with max width', () => {
    const wrapper = factory();
    wrapper.setProps({ imageUrl: '//images.ctfassets.net/example/example.jpg',
      imageContentType: 'image/jpeg',
      imageMaxDimensions: { width: 510 }
    });

    wrapper.vm.optimisedImageUrl.should.contain('fm=jpg&fl=progressive&q=50&w=510');
  });
});
