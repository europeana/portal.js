import sinon from 'sinon';
import { computed } from 'vue';
import useLikedItems from '@/composables/likedItems.js';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const itemIds = ['/123/abc', '/123/def'];
const likesId = '123';
const setApiDeleteItemsStub = sinon.stub();
const setApiInsertItemsStub = sinon.stub();
const setApiSearchItemsStub = sinon.stub().resolves({
  items: ['http://data.europeana.eu/item/123/abc']
});

const component = {
  template: '<span />',
  props: {
    itemIds: {
      type: Array,
      default: null
    }
  },
  setup(props) {
    return useLikedItems(computed(() => props.itemIds));
  }
};

const localVue = createLocalVue();
localVue.use((Vue) => {
  // mock these here so they apply to the component $root instance
  Vue.prototype.$apis = {
    set: {
      deleteItems: setApiDeleteItemsStub,
      insertItems: setApiInsertItemsStub,
      searchItems: setApiSearchItemsStub
    }
  };
  Vue.prototype.$store = {
    state: {
      set: {
        likesId
      }
    }
  };
});

const factory = ({ propsData = {} } = {}) => shallowMount(component, {
  localVue,
  propsData
});

describe('useLikedItems', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('likedItems', () => {
    describe('when there are no item IDs', () => {
      const propsData = { itemIds: undefined };

      it('does not query the Set API', async() => {
        factory({ propsData });

        await new Promise(process.nextTick);

        expect(setApiSearchItemsStub.called).toBe(false);
      });

      it('gets value of an empty object', async() => {
        const wrapper = factory({ propsData });

        await new Promise(process.nextTick);

        expect(wrapper.vm.likedItems).toEqual({});
      });
    });

    describe('when there are item IDs', () => {
      const propsData = { itemIds };

      it('queries the Set API', async() => {
        factory({ propsData });

        await new Promise(process.nextTick);

        expect(setApiSearchItemsStub.calledWith(likesId, itemIds)).toBe(true);
      });

      it('gets value of an object with true/false representing liked state', async() => {
        const wrapper = factory({ propsData });

        await new Promise(process.nextTick);

        expect(wrapper.vm.likedItems).toEqual({
          '/123/abc': true,
          '/123/def': false
        });
      });
    });
  });

  describe('like', () => {
    it('adds item to likes set via Set API', async() => {
      const wrapper = factory();

      await wrapper.vm.like(itemIds[0]);

      expect(setApiInsertItemsStub.calledWith(likesId, itemIds[0])).toBe(true);
    });

    it('touches lastModified', async() => {
      const date = new Date('2025-01-01');
      const wrapper = factory();
      jest.useFakeTimers();
      jest.setSystemTime(date);

      await wrapper.vm.like(itemIds[0]);

      expect(wrapper.vm.lastModified).toEqual(date.getTime());
      jest.useRealTimers();
    });
  });

  describe('unlike', () => {
    it('removes item from likes set via Set API', async() => {
      const wrapper = factory();

      await wrapper.vm.unlike(itemIds[0]);

      expect(setApiDeleteItemsStub.calledWith(likesId, itemIds[0])).toBe(true);
    });

    it('touches lastModified', async() => {
      const date = new Date('2025-01-02');
      const wrapper = factory();
      jest.useFakeTimers();
      jest.setSystemTime(date);

      await wrapper.vm.unlike(itemIds[0]);

      expect(wrapper.vm.lastModified).toEqual(date.getTime());
      jest.useRealTimers();
    });
  });
});
