import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PaginationNavInput from '@/components/generic/PaginationNavInput.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const scrollToSpy = sinon.spy();
const gotoSpy = sinon.spy();

const factory = (options = {}) => shallowMount(PaginationNavInput, {
  localVue,
  mocks: {
    ...{
      $t: () => {},
      $route: { query: { page: 1 } },
      $scrollTo: scrollToSpy,
      $goto: gotoSpy
    }, ...(options.mocks || {})
  }
});

describe('components/generic/PaginationNavInput', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    it('disables the previous button on first page', async() => {
      const wrapper = factory();
      await wrapper.setProps({ totalResults: 240, perPage: 24 });

      const prevButton =  wrapper.find('[data-qa="prev button"]');
      expect(prevButton.attributes().class).toContain('disabled');
    });

    it('disables the next button on last page', async() => {
      const wrapper = factory({
        mocks: {
          $route: {
            query: {
              page: 10
            }
          }
        }
      });
      await wrapper.setProps({ totalResults: 240, perPage: 24 });

      const nextButton =  wrapper.find('[data-qa="next button"]');
      expect(nextButton.attributes().class).toContain('disabled');
    });
  });

  describe('computed', () => {
    describe('totalPages', () => {
      it('calculates total number of pages', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });

        expect(wrapper.vm.totalPages).toBe(10);
      });
    });
  });

  describe('watch', () => {
    describe('$route.query.page', () => {
      it('updates the page data property', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });

        wrapper.vm.$route.query.page = 5;
        await wrapper.vm.$nextTick;

        expect(wrapper.vm.page).toBe(5);
      });

      it('defaults the page data property to 1', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });

        wrapper.vm.$route.query.page = undefined;
        await wrapper.vm.$nextTick;

        expect(wrapper.vm.page).toBe(1);
      });

    });
  });

  describe('methods', () => {
    describe('changePaginationNav()', () => {
      it('triggers a redirect to the new page', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });
        await wrapper.setData({ page: 2 });

        wrapper.vm.changePaginationNav();
        expect(gotoSpy.called).toBe(true);
      });
    });

    describe('linkGen', () => {
      it('returns an object with the new pageNo', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });

        const generatedLink = wrapper.vm.linkGen(2);
        expect(generatedLink).toEqual({ query: { page: 2 } });
      });
    });
  });
});
