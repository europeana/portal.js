import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PaginationNavInput from '@/components/generic/PaginationNavInput.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ data, mocks, propsData } = {}) => shallowMount(PaginationNavInput, {
  localVue,
  data() {
    return {
      ...data
    };
  },
  mocks: {
    $t: (key) => key,
    $route: { query: { page: 1 } },
    $router: { push: sinon.spy() },
    ...mocks
  },
  propsData
});

describe('components/generic/PaginationNavInput', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('previous button', () => {
      it('is disabled on the first page', () => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        const prevButton = wrapper.find('[data-qa="prev button"]');

        expect(prevButton.attributes().class).toContain('disabled');
      });

      it('displays text by default', () => {
        const wrapper = factory();

        const prevButton = wrapper.find('[data-qa="prev button"]');

        expect(prevButton.text()).toBe('actions.previous');
      });

      it('omits text if `buttonText` prop is `false`', () => {
        const wrapper = factory({
          propsData: { buttonText: false }
        });

        const prevButton = wrapper.find('[data-qa="prev button"]');

        expect(prevButton.text()).toBe('');
      });

      it('displays icon by default', () => {
        const wrapper = factory();

        const prevButtonIcon = wrapper.find('[data-qa="prev button icon"]');

        expect(prevButtonIcon.exists()).toBe(true);
      });

      it('omits icon if `buttonIcons` prop is `false`', () => {
        const wrapper = factory({
          propsData: { buttonIcons: false }
        });

        const prevButtonIcon = wrapper.find('[data-qa="prev button icon"]');

        expect(prevButtonIcon.exists()).toBe(false);
      });
    });

    describe('next button', () => {
      it('is disabled on the last page', () => {
        const wrapper = factory({
          mocks: { $route: { query: { page: 10 } } },
          propsData: { totalResults: 240, perPage: 24 }
        });

        const nextButton = wrapper.find('[data-qa="next button"]');

        expect(nextButton.attributes().class).toContain('disabled');
      });

      it('displays text by default', () => {
        const wrapper = factory();

        const nextButton = wrapper.find('[data-qa="next button"]');

        expect(nextButton.text()).toBe('actions.next');
      });

      it('omits text if `buttonText` prop is `false`', () => {
        const wrapper = factory({
          propsData: { buttonText: false }
        });

        const nextButton = wrapper.find('[data-qa="next button"]');

        expect(nextButton.text()).toBe('');
      });

      it('displays icon by default', () => {
        const wrapper = factory();

        const nextButtonIcon = wrapper.find('[data-qa="next button icon"]');

        expect(nextButtonIcon.exists()).toBe(true);
      });

      it('omits icon if `buttonIcons` prop is `false`', () => {
        const wrapper = factory({
          propsData: { buttonIcons: false }
        });

        const nextButtonIcon = wrapper.find('[data-qa="next button icon"]');

        expect(nextButtonIcon.exists()).toBe(false);
      });
    });

    describe('page input', () => {
      it('is present by default', () => {
        const wrapper = factory();

        const paginationInput = wrapper.find('[data-qa="pagination input"]');

        expect(paginationInput.exists()).toBe(true);
      });

      it('is not present if `pageInput` prop is `false`', () => {
        const wrapper = factory({
          propsData: { pageInput: false }
        });

        const paginationInput = wrapper.find('[data-qa="pagination input"]');

        expect(paginationInput.exists()).toBe(false);
      });
    });

    describe('progress indicator', () => {
      it('is by default not present', () => {
        const wrapper = factory();

        const paginationInput = wrapper.find('[data-qa="pagination progress"]');

        expect(paginationInput.exists()).toBe(false);
      });

      it('is present, and shows progress, if `progress` prop is `true`', () => {
        const wrapper = factory({
          mocks: { $route: { query: { page: 2 } } },
          propsData: { perPage: 1, progress: true, totalResults: 3 }
        });

        const paginationInput = wrapper.find('[data-qa="pagination progress"]');

        expect(paginationInput.text()).toBe('2/3');
      });
    });
  });

  describe('computed', () => {
    describe('totalPages', () => {
      it('calculates total number of pages', () => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        expect(wrapper.vm.totalPages).toBe(10);
      });
    });
  });

  describe('watch', () => {
    describe('$route.query.page', () => {
      it('updates the page data property', async() => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        wrapper.vm.$route.query.page = 5;
        await wrapper.vm.$nextTick;

        expect(wrapper.vm.page).toBe(5);
      });

      it('defaults the page data property to 1', async() => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        wrapper.vm.$route.query.page = undefined;
        await wrapper.vm.$nextTick;

        expect(wrapper.vm.page).toBe(1);
      });
    });
  });

  describe('methods', () => {
    describe('changePaginationNav()', () => {
      it('triggers a redirect to the new page', () => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        wrapper.vm.changePaginationNav();

        expect(wrapper.vm.$router.push.called).toBe(true);
      });

      it('does nothing if page is blank', () => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 },
          data: { page: '' }
        });

        wrapper.vm.changePaginationNav();

        expect(wrapper.vm.$router.push.called).toBe(false);
      });
    });

    describe('linkGen', () => {
      it('returns an object with the new pageNo', () => {
        const wrapper = factory({
          propsData: { totalResults: 240, perPage: 24 }
        });

        const generatedLink = wrapper.vm.linkGen(2);
        expect(generatedLink).toEqual({ query: { page: 2 } });
      });
    });
  });
});
