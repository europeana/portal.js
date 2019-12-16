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
    localePath: (val) => val
  }
});

const entityDetails = {
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  attribution: 'http://commons.wikimedia.org/wiki/Special:FilePath/View_of_Santa_Maria_del_Fiore_in_Florence.jpg',
  depiction: 'https://commons.wikimedia.org/wiki/File:View_of_Santa_Maria_del_Fiore_in_Florence.jpg'
};

describe('components/entity/EntityDetails', () => {
  it('shows a description, attribution and depiction', () => {
    const wrapper = factory(entityDetails);

    wrapper.find('img').attributes('src').should.eq(entityDetails.depiction);
    wrapper.find('a[data-qa="entity attribution"]').attributes('href').should.eq(entityDetails.attribution);
    wrapper.text().should.contain(entityDetails.description.values[0]);
  });

  it('shows a description only', () => {
    const wrapper = factory({ 'description': entityDetails.description });

    wrapper.findAll('img').length.should.eq(0);
    wrapper.findAll('a[data-qa="entity attribution"]').length.should.eq(0);
    wrapper.text().should.contain(entityDetails.description.values[0]);
  });

  it('shows a depiction only', () => {
    const wrapper = factory({ 'depiction': entityDetails.depiction, 'attribution': entityDetails.attribution });

    wrapper.findAll('img').length.should.eq(1);
    wrapper.text().should.not.contain(entityDetails.description.values[0]);
  });

  it('does not show a show more link', () => {
    const wrapper = factory(entityDetails);
    wrapper.findAll('a[data-qa="entity show link"]').length.should.eq(0);
  });

  it('shows a show more link', () => {
    const longDescription = entityDetails.description.values[0] + entityDetails.description.values[0] + entityDetails.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' } });

    wrapper.findAll('a[data-qa="entity show link"]').length.should.eq(1);
  });
});
