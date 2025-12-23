import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import HomeLatestStories from '@/components/home/HomeLatestStories.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulQueryResponse = {
  data: {
    storyCollection: {
      items: [
        { identifier: 'story-1', datePublished: '2022-09-26T08:00:00.000+02:00' },
        { identifier: 'story-2', datePublished: '2022-11-26T08:00:00.000+02:00' },
        { identifier: 'story-3', datePublished: '2022-10-26T08:00:00.000+02:00' }
      ]
    },
    exhibitionPageCollection: {
      items: [
        { identifier: 'exhibition-1', datePublished: '2022-10-26T08:00:00.000+02:00' },
        { identifier: 'exhibition-2', datePublished: '2022-12-26T08:00:00.000+02:00' },
        { identifier: 'exhibition-3', datePublished: '2022-08-26T08:00:00.000+02:00' }
      ]
    }
  }
};

const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(contentfulQueryResponse);

const factory = () => shallowMountNuxt(HomeLatestStories, {
  localVue,
  stubs: ['b-card-group'],
  mocks: {
    $contentful: {
      query: contentfulQueryStub
    },
    $i18n: {
      localeProperties: { iso: 'en-GB' }
    },
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/home/HomeLatestStories', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    it('shows a section with editorial content', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      const section =  wrapper.find('[data-qa="latest editorial"]');
      expect(section.exists()).toBe(true);
    });

    it('shows a card for each story', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      const section =  wrapper.find('[data-qa="latest editorial"]');
      expect(section.findAll('contentcard-stub').length).toBe(4);
    });
  });

  describe('fetch', () => {
    it('queries CTF for latest editorial', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match.object, {
        locale: 'en-GB',
        preview: false,
        limit: 3
      })).toBe(true);
    });

    it('shows 4 cards, by date published, at least one of each type', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.cards.length).toBe(4);
      expect(wrapper.vm.cards.at(0).identifier).toEqual('exhibition-2');
      expect(wrapper.vm.cards.at(1).identifier).toEqual('story-2');
      expect(wrapper.vm.cards.at(2).identifier).toEqual('story-3');
      expect(wrapper.vm.cards.at(3).identifier).toEqual('exhibition-1');
    });
  });

  describe('methods', () => {
    describe('cardImage', () => {
      it('uses primaryImageOfPage URL', () => {
        const wrapper = factory();

        const image = wrapper.vm.cardImage({
          __typename: 'ExhibitionPage',
          primaryImageOfPage: {
            image: {
              url: 'image.jpg'
            }
          }
        });

        expect(image).toBe('image.jpg');
      });
    });
  });
});
