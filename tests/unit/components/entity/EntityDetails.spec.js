import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityDetails from '../../../../src/components/entity/EntityDetails.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $i18n = {
  locale: 'en'
};

const factory = (propsData = {}) => mount(EntityDetails, {
  localVue,
  propsData,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $t: (val) => val,
    $i18n,
    $path: () => '/'
  }
});

const entityDetails = {
  title: { values: ['Book'], code: 'en' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  attribution: 'http://www.europeana.eu/item/123/abc'
};

describe('components/entity/EntityDetails', () => {
  it('shows a title and description', () => {
    const wrapper = factory(entityDetails);

    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
    wrapper.text().should.contain(entityDetails.description.values[0]);
  });

  it('shows a description and title only', () => {
    const wrapper = factory({ 'description': entityDetails.description, title: entityDetails.title });

    wrapper.findAll('img').length.should.eq(0);
    wrapper.text().should.contain(entityDetails.description.values[0]);
    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
  });

  it('shows a title only', () => {
    const wrapper = factory({ title: entityDetails.title });

    wrapper.text().should.not.contain(entityDetails.description.values[0]);
    wrapper.find('[data-qa="entity title"]').text().should.eq('Book');
    wrapper.find('[data-qa="entity title"]').attributes('lang').should.eq('en');
  });

  it('does not show a show more button', () => {
    const wrapper = factory(entityDetails);
    wrapper.findAll('button[data-qa="entity show link"]').length.should.eq(0);
  });

  it('shows a show more button', () => {
    const longDescription = entityDetails.description.values[0] + entityDetails.description.values[0] + entityDetails.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' }, title: entityDetails.title });

    wrapper.findAll('button[data-qa="entity show link"]').length.should.eq(1);
  });
});
