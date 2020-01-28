import { createLocalVue, mount } from '@vue/test-utils';
import ExhibitionChaptersNavigation from '../../../../components/exhibition/ExhibitionChaptersNavigation.vue';

const localVue = createLocalVue();

const $route = {
  params: {
    chapter: 'astilbe'
  }
};

const chapters = [{
  fields: {
    name: 'Allium',
    identifier: 'allium'
  }
},
{
  fields: {
    name: 'Astilbe',
    identifier: 'astilbe'
  }
},
{
  fields: {
    name: 'Calls for education',
    identifier: 'calls-for-education'
  }
}];

const factory = () => mount(ExhibitionChaptersNavigation, {
  localVue,
  stubs: ['b-link'],
  mocks: {
    $route,
    localePath: (opts) => opts
  },
  propsData: {
    exhibitionIdentifier: 'an-exhibition',
    chapters
  }
});

describe('components/exhibition/ExhibitionChaptersNavigation', () => {
  it('shows a previous and next chapter button', () => {
    const wrapper = factory();
    const previous = wrapper.find('[data-qa="previous chapter button"]');
    previous.isVisible().should.be.true;

    const next = wrapper.find('[data-qa="next chapter button"]');
    next.isVisible().should.be.true;
  });
});

describe('components/exhibition/ExhibitionChaptersNavigation', () => {
  it('shows a previous chapter button only', () => {
    const wrapper = factory();
    wrapper.vm.currentChapter = 'allium';

    const previous = wrapper.find('[data-qa="previous chapter button"]');
    previous.exists().should.be.false;

    const next = wrapper.find('[data-qa="next chapter button"]');
    next.isVisible().should.be.true;
  });
});

describe('components/exhibition/ExhibitionChaptersNavigation', () => {
  it('shows a next chapter button only', () => {
    const wrapper = factory();
    wrapper.vm.currentChapter = 'calls-for-education';

    const previous = wrapper.find('[data-qa="previous chapter button"]');
    previous.isVisible().should.be.true;

    const next = wrapper.find('[data-qa="next chapter button"]');
    next.exists().should.be.false;
  });
});
