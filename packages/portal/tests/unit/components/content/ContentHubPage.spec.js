import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ContentHubPage from '@/components/content/ContentHubPage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

// Creates an array of 25 number strings
const identifiers = [...Array(25).keys()].map((key) => (key + 1).toString());

const pageOfItems = [...identifiers].map((identifier) => {
  return { identifier, description: 'page description', name: 'page name',
    primaryImageOfPage: { image: { url: 'https://www.example.eu/image.jpg', contentType: 'image/jpeg', description: 'image alt text' } } };
});

const pageOfGalleries = [...identifiers].map((identifier) => {
  return { slug: identifier, description: 'gallery description', title: 'gallery title', thumbnail: 'https://www.example.eu/image.jpg' };
});

const testPropsData = {
  pageMeta: { title: 'Title' },
  title: 'Test title',
  items: pageOfItems,
  perPage: 24,
  total: 25,
  cardUrlName: 'test-all'
};

const testGalleriesPropsData = {
  pageMeta: { title: 'Galleries title' },
  title: 'Galleries title',
  items: pageOfGalleries,
  perPage: 24,
  total: 25,
  cardUrlName: 'galleries-all'
};

const factory = (propsData = testPropsData) => shallowMount(ContentHubPage, {
  localVue,
  propsData
});

describe('components/content/ContentHubPage', () => {
  it('displays a content header', async() => {
    const wrapper = factory();

    const contentHeader = wrapper.find('contentheader-stub');

    expect(contentHeader.exists()).toBe(true);
  });

  describe('when there are items', () => {
    it('displays content cards for each item', async() => {
      const wrapper = factory();

      const itemsLength = wrapper.vm.items.length;
      const contentCards = wrapper.findAll('contentcard-stub');

      expect(contentCards.length).toEqual(itemsLength);
    });
  });

  describe('when the items are galleries', () => {
    it('uses the item slug, title and thumbnail to create cards', async() => {
      const firstItem = testGalleriesPropsData.items[0];
      const wrapper = factory(testGalleriesPropsData);

      const contentCard = wrapper.find('contentcard-stub');

      expect(contentCard.attributes('title')).toEqual(firstItem.title);
      expect(contentCard.attributes('imageurl')).toEqual(firstItem.thumbnail);
    });
  });

  describe('when the total amount of items is more than per page', () => {
    it('displays pagination', async() => {
      const wrapper = factory();

      const pagination = wrapper.find('paginationnavinput-stub');

      expect(pagination.exists()).toBe(true);
    });
  });

  describe('when the total amount of items is less than per page', () => {
    it('does not display pagination', async() => {
      const testPropsDataWithLessItems = { ...testPropsData, items: pageOfItems.slice(0, 10), total: 10 };
      const wrapper = factory(testPropsDataWithLessItems);

      const pagination = wrapper.find('paginationnavinput-stub');

      expect(pagination.exists()).toBe(false);
    });
  });
});
