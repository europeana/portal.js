import exhibitionChapters from '@/mixins/exhibitionChapters';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/exhibitions/_exhibition/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const description = 'this describes the exhibition';
const primaryImageOfPage = {
  url: 'http://example.org/contentful/asset.jpg',
  image: {
    url: 'http://example.org/contentful/asset.jpg',
    description: ''
  }
};

const defaultOptions = {
  description,
  primaryImageOfPage
};

const factory = (options = defaultOptions) => shallowMountNuxt(page, {
  localVue,
  mixins: [
    exhibitionChapters
  ],
  data() {
    return {
      identifier: 'exhibition',
      name: '',
      headline: '',
      description: options.description,
      text: '',
      primaryImageOfPage: options.primaryImageOfPage,
      hasPartCollection: {
        items: [
          {
            name: 'exhibition part 1',
            identifier: 'exhibition-part-1',
            primaryImageOfPage: {
              image: {
                url: 'https://www.example.eu/image1.jpg',
                description: 'Chapter image description'
              }
            }
          }
        ]
      },
      credits: '',
      contentWarning: null,
      relatedLink: [
        'http://data.europeana.eu/concept/194',
        'http://data.europeana.eu/concept/21'
      ],
      categoriesCollection: options.tags || null
    };
  },
  mocks: {
    $contentful: {
      assets: {
        optimisedSrc: (img) => `${img?.url}?optimised`
      }
    },
    $t: key => key,
    $tc: () => {},
    $pageHeadTitle: key => key,
    $path: () => '/',
    $store: {
      commit: sinon.spy()
    }
  }
});

describe('exhibitionChapters mixin', () => {
  it('chapterPagesToLinkListItems returns a url for each chapter', async() => {
    const wrapper = factory();
    const chapterList = wrapper.vm.hasPartCollection.items;
    const currentExhibitionIdentifier = wrapper.vm.identifier;
    const linkListItems = await wrapper.vm.chapterPagesToLinkListItems(chapterList, currentExhibitionIdentifier);
    const expectedChapterUrl = {
      name: 'exhibitions-exhibition-chapter',
      params: {
        exhibition: 'exhibition', chapter: 'exhibition-part-1'
      }
    };

    expect(linkListItems[0].url).toEqual(expectedChapterUrl);
  });

  it('chapterPagesToLinkListItems returns a background for each chapter where present', async() => {
    const wrapper = factory();
    const chapterList = wrapper.vm.hasPartCollection.items;
    const currentExhibitionIdentifier = wrapper.vm.identifier;
    const linkListItems = await wrapper.vm.chapterPagesToLinkListItems(chapterList, currentExhibitionIdentifier);
    const expectedChapterBackground = 'https://www.example.eu/image1.jpg?optimised';

    expect(linkListItems[0].background).toEqual(expectedChapterBackground);
  });

  it('chapterPagesToLinkListItems returns a text for each chapter', async() => {
    const wrapper = factory();
    const chapterList = wrapper.vm.hasPartCollection.items;
    const currentExhibitionIdentifier = wrapper.vm.identifier;
    const linkListItems = await wrapper.vm.chapterPagesToLinkListItems(chapterList, currentExhibitionIdentifier);
    const expectedChapterText = 'exhibition part 1';

    expect(linkListItems[0].text).toEqual(expectedChapterText);
  });
});

describe('Exhibition landing page', () => {
  describe('head()', () => {
    it('uses optimised hero image for og:image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(`${primaryImageOfPage.url}?optimised`);
    });
    it('uses optimised hero image description for og:image:alt', () => {
      primaryImageOfPage.image.description = 'alt description for hero image';
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image:alt').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image:alt').content).toBe(primaryImageOfPage.image.description);
    });
    it('uses description for og:description', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:description').content).toBe(description);
    });
    it('does not populate metatags when no data available', () => {
      const wrapper = factory({});

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:description').length).toBe(0);
      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(0);
    });
  });

  describe('beforeRouteLeave', () => {
    it('resets set id and set entity', async() => {
      const to = { name: 'search__eu', fullPath: '/en/search', matched: [{ path: '/en/search' }] };
      const wrapper = factory();

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(wrapper.vm.$store.commit.calledWith('breadcrumb/clearBreadcrumb')).toBe(true);
      expect(next.called).toBe(true);
    });
  });

  describe('related category tags', () => {
    it('are rendered when there are any', () => {
      const wrapper = factory({ tags: { items: [{ name: 'surrealism' }] } });

      const RelatedCategoryTags = wrapper.find('[data-qa="related category tags"]');

      expect(RelatedCategoryTags.exists()).toBe(true);
    });
    it('are not loaded when there are none', () => {
      const wrapper = factory();

      const RelatedCategoryTags = wrapper.find('[data-qa="related category tags"]');

      expect(RelatedCategoryTags.exists()).toBe(false);
    });
  });
});
