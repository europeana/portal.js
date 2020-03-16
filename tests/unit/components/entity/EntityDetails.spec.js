import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityDetails from '../../../../components/entity/EntityDetails.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locale: 'en'
};

const factory = (propsData = {}) => mount(EntityDetails, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val,
    $i18n,
    $path: () => '/'
  }
});

const entityDetails = {
  title: { values: ['Book'], code: 'en' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  attribution: 'http://www.europeana.eu/item/123/abc',
  depiction: 'https://www.example.org/image.jpeg'
};

describe('components/entity/EntityDetails', () => {
  it('shows a title, description, attribution and depiction', () => {
    const wrapper = factory(entityDetails);

    wrapper.find('img').attributes('src').should.eq(entityDetails.depiction);
    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
    wrapper.find('a[data-qa="entity attribution"]').attributes('href').should.eq(entityDetails.attribution);
    wrapper.text().should.contain(entityDetails.description.values[0]);
  });

  it('shows a description and title only', () => {
    const wrapper = factory({ 'description': entityDetails.description, title: entityDetails.title });

    wrapper.findAll('img').length.should.eq(0);
    wrapper.findAll('a[data-qa="entity attribution"]').length.should.eq(0);
    wrapper.text().should.contain(entityDetails.description.values[0]);
    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
  });

  it('shows a depiction and title only', () => {
    const wrapper = factory({ 'depiction': entityDetails.depiction, 'attribution': entityDetails.attribution, title: entityDetails.title });

    wrapper.findAll('img').length.should.eq(1);
    wrapper.text().should.not.contain(entityDetails.description.values[0]);
    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
  });

  it('does not show a show more link', () => {
    const wrapper = factory(entityDetails);
    wrapper.findAll('a[data-qa="entity show link"]').length.should.eq(0);
  });

  it('shows a show more link', () => {
    const longDescription = entityDetails.description.values[0] + entityDetails.description.values[0] + entityDetails.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' }, title: entityDetails.title });

    wrapper.findAll('a[data-qa="entity show link"]').length.should.eq(1);
  });
});
