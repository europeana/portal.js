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
  afterEach(() => {
    sinon.resetHistory();
  });

  it('shows pagination for number of pages', async() => {
    const wrapper = factory();
    await wrapper.setProps({ totalResults: 240, perPage: 24 });

    expect(wrapper.vm.totalPages).toBe(10);
  });

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

  describe('methods', () => {
    describe('changePaginationNav()', () => {
      it('triggers a scroll and redirect to the  new page', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });
        await wrapper.setData({ page: 2 });

        wrapper.vm.changePaginationNav();
        expect(scrollToSpy.called).toBe(true);
        expect(gotoSpy.called).toBe(true);
      });
    });

    describe('scrollToElement', () => {
      it('triggers a scroll', async() => {
        const wrapper = factory();
        await wrapper.setProps({ totalResults: 240, perPage: 24 });

        wrapper.vm.scrollToElement();
        expect(scrollToSpy.called).toBe(true);
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
