import exhibitionChapters from '@/mixins/exhibitionChapters';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/exhibitions/_exhibition/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const heroImageUrl = 'http://example.org/contentful/asset.jpg';

const factory = () => shallowMountNuxt(page, {
  localVue,
  mixins: [
    exhibitionChapters
  ],
  data() {
    return {
      identifier: 'exhibition',
      name: '',
      headline: '',
      description: '',
      text: '',
      primaryImageOfPage: {
        image: {
          url: heroImageUrl,
          description: 'Hero image description'
        }
      },
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
      relatedLink: { items: [{ name: 'art' }] },
      categoriesCollection: { items: [{ name: 'surrealism' }] }
    };
  },
  mocks: {
    $t: key => key,
    $tc: () => {},
    $pageHeadTitle: key => key
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
    const expectedChapterBackground = 'https://www.example.eu/image1.jpg';

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
    it('uses hero image for og:image', () => {
      const wrapper = factory();

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(heroImageUrl);
    });
  });
});
