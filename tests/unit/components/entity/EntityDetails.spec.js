import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityDetails from '@/components/entity/EntityDetails.vue';

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
  contextLabel: 'Person'
};

describe('components/entity/EntityDetails', () => {
  it('shows a label', () => {
    const wrapper = factory(entityDetails);

    expect(wrapper.find('[data-qa="entity label"]').text()).toBe('Person');
  });

  it('shows a title and description', () => {
    const wrapper = factory(entityDetails);

    expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
    expect(wrapper.find('[data-qa="entity title"]').attributes('lang')).toBe('en');
    expect(wrapper.text()).toContain(entityDetails.description.values[0]);
  });

  it('shows a description and title only', () => {
    const wrapper = factory({ 'description': entityDetails.description, title: entityDetails.title, contextLabel: entityDetails.contextLabel });

    expect(wrapper.findAll('img').length).toBe(0);
    expect(wrapper.text()).toContain(entityDetails.description.values[0]);
    expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
    expect(wrapper.find('[data-qa="entity title"]').attributes('lang')).toBe('en');
  });

  it('shows a title only', () => {
    const wrapper = factory({ title: entityDetails.title, contextLabel: entityDetails.contextLabel });

    expect(wrapper.text()).not.toContain(entityDetails.description.values[0]);
    expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
    expect(wrapper.find('[data-qa="entity title"]').attributes('lang')).toBe('en');
  });

  it('does not show a show more button', () => {
    const wrapper = factory(entityDetails);
    expect(wrapper.findAll('button[data-qa="entity show link"]').length).toBe(0);
  });

  it('shows a show more button', () => {
    const longDescription = entityDetails.description.values[0] + entityDetails.description.values[0] + entityDetails.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' }, title: entityDetails.title, contextLabel: entityDetails.contextLabel });

    expect(wrapper.findAll('button[data-qa="entity show link"]').length).toBe(1);
  });

  it('shows a logo', () => {
    entityDetails.logo = 'http://commons.wikimedia.org/wiki/Special:FilePath/Uni-Leiden-seal.png';

    const wrapper = factory(entityDetails);
    expect(wrapper.findAll('[data-qa="entity logo"]').exists()).toBe(true);
  });

  describe('external link', () => {
    it('links to the external link', () => {
      entityDetails.externalLink = 'https://historymuseum.org/en/';

      const wrapper = factory(entityDetails);
      expect(wrapper.findAll('[data-qa="entity external link"]').exists()).toBe(true);
      expect(wrapper.find('[data-qa="entity external link"] a').attributes('href')).toBe(entityDetails.externalLink);
    });
    it('shows a stripped link text', () => {
      entityDetails.externalLink = 'https://historymuseum.org/en/';

      const wrapper = factory(entityDetails);
      expect(wrapper.findAll('[data-qa="entity external link"]').exists()).toBe(true);
      expect(wrapper.find('[data-qa="entity external link"] a span:first-child').text()).toBe('historymuseum.org/en/');
    });
  });
});
