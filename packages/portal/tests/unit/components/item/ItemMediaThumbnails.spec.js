import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemMediaThumbnails from '@/components/item/ItemMediaThumbnails';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(ItemMediaThumbnails, {
  localVue,
  attachTo: document.body,
  propsData: {
    edmType: 'image',
    ...propsData
  },
  mocks: {
    $t: (key) => key,
    ...mocks
  }
});

describe('components/item/ItemMediaThumbnail', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    it('renders media thumbnails', () => {
      const wrapper = factory();

      const thumbnail = wrapper.find('.media-thumbnails');

      expect(thumbnail.isVisible()).toBe(true);
    });
  });

  describe('when the selected page is after the first page', () => {
    beforeAll(() => {
      sinon.stub(itemMediaPresentation, 'default').returns({
        page: 2,
        resources: [
          {},
          {}
        ]
      });
    });
    afterAll(() => {
      itemMediaPresentation.default.restore();
    });

    it('instant-scrolls the thumbnails bar to the active position', async() => {
      const wrapper = factory({ mocks: { page: 2 } });
      wrapper.vm.scrollElementToCentre = sinon.spy();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.scrollElementToCentre.calledWith(
        sinon.match.any,
        sinon.match.has('behavior', 'instant')
      )).toBe(true);
    });

    describe('when the media thumbnails element is not yet available', () => {
      it('does not scroll the thumbnails bar', () => {
        const wrapper = factory({ mocks: { page: 2 } });
        wrapper.vm.scrollElementToCentre = sinon.spy();
        wrapper.vm.$refs.mediaThumbnails = null;

        expect(wrapper.vm.scrollElementToCentre.called).toBe(false);
      });
    });
  });

  describe('on resize', () => {
    it('smooth-scrolls the thumbnails bar to the active position', () => {
      const wrapper = factory();
      wrapper.vm.scrollElementToCentre = sinon.spy();

      window.dispatchEvent(new Event('resize'));

      expect(wrapper.vm.scrollElementToCentre.calledWith(
        sinon.match.any,
        sinon.match.has('behavior', 'smooth')
      )).toBe(true);
    });
  });

  describe('on destroy', () => {
    it('should remove resize event listener', () => {
      const wrapper = factory();

      const removeEventListener = sinon.spy(window, 'removeEventListener');

      wrapper.destroy();

      expect(removeEventListener.called).toBe(true);
    });
  });

  describe('when there are more than 20 pages', () => {
    afterEach(() => {
      itemMediaPresentation.default.restore();
    });
    const manyResources = Array.from({ length: 100 }, (element, index) => {
      return { about: `https://resource.eu/${index}` };
    });
    describe('and on page 1', () => {
      it('appends a skeleton list item to the list', () => {
        sinon.stub(itemMediaPresentation, 'default').returns({
          page: 1,
          resources: manyResources
        });
        const wrapper = factory();

        const skeletonAfter = wrapper.find('[data-qa="item media thumbnail skeleton after"]');

        expect(skeletonAfter.exists()).toBe(true);
      });

      describe('when intersecting the skeleton after', () => {
        it('appends items', () => {
          sinon.stub(itemMediaPresentation, 'default').returns({
            page: 1,
            resources: manyResources
          });
          window.IntersectionObserver = class {
            constructor(callback) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
          };
          window.IntersectionObserverEntry = class {};

          const wrapper = factory();

          expect(wrapper.vm.skeletonObserver).toBeInstanceOf(IntersectionObserver);
          expect(wrapper.vm.resourcesToRender.length).toBe(20);

          // Simulate the intersection
          const entries = [{ intersectionRatio: 0.5,
            target: wrapper.vm.$refs.thumbnailSkeletonAfter }];
          wrapper.vm.skeletonObserver.callback(entries);

          expect(wrapper.vm.resourcesToRender.length).toBe(30);
        });
      });
    });

    describe('and on page 11 or more', () => {
      it('prepends a skeleton list item to the list', () => {
        sinon.stub(itemMediaPresentation, 'default').returns({
          page: 11,
          resources: manyResources
        });
        const wrapper = factory();

        const skeletonBefore = wrapper.find('[data-qa="item media thumbnail skeleton before"]');

        expect(skeletonBefore.exists()).toBe(true);
      });

      describe('when intersecting the skeleton before', () => {
        it('prepends items', () => {
          sinon.stub(itemMediaPresentation, 'default').returns({
            page: 30,
            resources: manyResources
          });
          window.IntersectionObserver = class {
            constructor(callback) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
          };
          window.IntersectionObserverEntry = class {};

          const wrapper = factory();

          expect(wrapper.vm.skeletonObserver).toBeInstanceOf(IntersectionObserver);
          expect(wrapper.vm.resourcesToRender.length).toBe(20);

          // Simulate the intersection
          const entries = [{ isIntersecting: true, target: wrapper.vm.$refs.thumbnailSkeletonBefore }];
          wrapper.vm.skeletonObserver.callback(entries);

          expect(wrapper.vm.resourcesToRender.length).toBe(30);
        });
      });
    });
  });

  describe('methods', () => {
    describe('calculateSkeletonHeight', () => {
      it('calculates height based on ebucoreHeight and margin', () => {
        const resources = [
          { ebucoreHeight: 100, ebucoreWidth: 176 },
          { ebucoreHeight: 200, ebucoreWidth: 176 }
        ];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonHeight(resources);
        expect(result).toBe('332px'); // 100 + 200 + 16 + 16
      });

      it('defaults to min-height when dimensions are not provided', () => {
        const resources = [{}, {}];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonHeight(resources);
        expect(result).toBe('192px'); // 80 + 80 + 16 + 16
      });

      it('limits height at CSS max-height 480px', () => {
        const resources = [
          { ebucoreHeight: 1000, ebucoreWidth: 176 }
        ];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonHeight(resources);
        expect(result).toBe('496px'); // 480 + 16
      });
    });

    describe('calculateSkeletonWidth', () => {
      it('calculates width based on ebucoreWidth and CSS height', () => {
        const resources = [
          { ebucoreHeight: 124, ebucoreWidth: 124 }
        ];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonWidth(resources);
        expect(result).toBe('140px'); // (124/124)*124 + 16
      });

      it('defaults to min-width when dimensions are not provided', () => {
        const resources = [{}];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonWidth(resources);
        expect(result).toBe('64px'); // 48 + 16
      });

      it('limits width to 200px', () => {
        const resources = [
          { ebucoreHeight: 124, ebucoreWidth: 2480 }
        ];
        const wrapper = factory();

        const result = wrapper.vm.calculateSkeletonWidth(resources);
        expect(result).toBe('216px'); // 200 + 16
      });

      describe('when viewport width small', () => {
        it('calculates width based on ebucoreWidth and CSS height', () => {
          window.innerWidth = 600;
          const resources = [
            { ebucoreHeight: 58, ebucoreWidth: 58 }
          ];
          const wrapper = factory();

          const result = wrapper.vm.calculateSkeletonWidth(resources);
          expect(result).toBe('74px'); // (58/58)*58 + 16
        });
      });
    });
  });
});
