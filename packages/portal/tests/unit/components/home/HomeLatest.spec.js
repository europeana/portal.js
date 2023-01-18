import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import HomeLatest from '@/components/home/HomeLatest.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulQueryResponse = {
  data: {
    data: {
      blogPostingCollection: {
        items: [
          { identifier: 'blog-1', datePublished: '2022-09-26T08:00:00.000+02:00' },
          { identifier: 'blog-2', datePublished: '2022-11-26T08:00:00.000+02:00' }
        ]
      },
      exhibitionPageCollection: {
        items: [
          { identifier: 'exhibition-1', datePublished: '2022-10-26T08:00:00.000+02:00' },
          { identifier: 'exhibition-2', datePublished: '2022-12-26T08:00:00.000+02:00' }
        ]
      }
    }
  }
};

const factory = () => shallowMountNuxt(HomeLatest, {
  localVue,
  stubs: ['b-card-group'],
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $i18n: {
      isoLocale: () => 'en-GB'
    },
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/home/HomeLatest', () => {
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
      expect(section.findAll('contentcard-stub').length).toBe(3);
    });
  });

  describe('fetch', () => {
    it('queries CTF for latest editorial', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('latestEditorialContent', {
        locale: 'en-GB',
        preview: false,
        limit: 2
      })).toBe(true);
    });

    it('shows 3 cards, by date published, at least one of each type', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.cards.length).toBe(3);
      expect(wrapper.vm.cards.at(0).identifier).toEqual('exhibition-2');
      expect(wrapper.vm.cards.at(1).identifier).toEqual('blog-2');
      expect(wrapper.vm.cards.at(2).identifier).toEqual('exhibition-1');
    });
  });

  describe('methods', () => {
    describe('cardLink', () => {
      it('constructs exhibition links', () => {
        const wrapper = factory();

        const link = wrapper.vm.cardLink({
          __typename: 'ExhibitionPage',
          identifier: 'exhibition'
        });

        expect(link.name).toBe('exhibitions-exhibition');
      });

      it('constructs blog post links', () => {
        const wrapper = factory();

        const link = wrapper.vm.cardLink({
          __typename: 'BlogPosting',
          identifier: 'blog'
        });

        expect(link.name).toBe('blog-all');
      });
    });

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
