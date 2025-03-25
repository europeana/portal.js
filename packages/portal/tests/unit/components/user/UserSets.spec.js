import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';
import UserSets from '@/components/user/UserSets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const sets = [
  {
    id: '1',
    type: 'Collection',
    visibility: 'public',
    title: 'A new collection',
    description: 'A description',
    isShownBy: { thumbnail: 'http://www.example.org/image.jpg' },
    total: 1
  },
  {
    id: '2',
    type: 'Collection',
    visibility: 'public',
    title: 'A second collection'
  }
];

const factory = ({ propsData = {}, data = {}, $route = {} } = {}) => shallowMountNuxt(UserSets, {
  localVue,
  attachTo: document.body,
  propsData: { ...propsData },
  data: () => ({ ...data }),
  mocks: {
    $auth: { user: { sub: 'user-id' } },
    $config: { app: { internalLinkDomain: null } },
    $apis: {
      set: { search: sinon.stub().resolves({ items: sets, partOf: { total: sets.length } }) },
      thumbnail: { edmPreview: (img) => img?.edmPreview?.[0] }
    },
    $t: (key) => key,
    $tc: (key) => key,
    $router: { push: sinon.spy() },
    localePath: () => 'localizedPath',
    $i18n: { locale: 'en' },
    $route: {
      path: '/en/account',
      hash: '#public-galleries',
      query: {},
      ...$route
    },
    $store: {
      getters: {
        'set/creationPreview': (id) => id
      }
    }
  }
});

describe('components/user/UserSets', () => {
  describe('template', () => {
    it('renders a card for every user set', () => {
      const wrapper = factory({ data: { sets, total: 2 } });

      const renderedSets =  wrapper.findAll('[data-qa="user set"]');

      expect(renderedSets.at(0).attributes('title')).toBe('A new collection');
      expect(renderedSets.at(1).attributes('title')).toBe('A second collection');
    });
  });

  describe('fetch', () => {
    it('gets sets from the Set API', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.set.search.calledWith(
        {
          query: 'creator:user-id',
          profile: 'items.meta',
          pageSize: 19,
          page: 1,
          qf: ['type:Collection']
        }, { withMinimalItemPreviews: true }
      )).toBe(true);
    });

    it('optionally includes visibility filter', async() => {
      const wrapper = factory({ propsData: { visibility: 'public' } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.set.search.calledWith(
        {
          query: 'creator:user-id',
          profile: 'items.meta',
          pageSize: 19,
          page: 1,
          qf: ['type:Collection', 'visibility:public']
        }, { withMinimalItemPreviews: true }
      )).toBe(true);
    });

    it('queries user in contributor field for type "EntityBestItemsSet"', async() => {
      const wrapper = factory({ propsData: { type: 'EntityBestItemsSet' } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.set.search.calledWith(
        {
          query: 'contributor:user-id',
          profile: 'items.meta',
          pageSize: 19,
          page: 1,
          qf: ['type:EntityBestItemsSet']
        }, { withMinimalItemPreviews: true }
      )).toBe(true);
    });

    it('fetches 20 sets if create set button not shown', async() => {
      const wrapper = factory({ propsData: { showCreateSetButton: false } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.set.search.calledWith(
        {
          query: 'creator:user-id',
          profile: 'items.meta',
          pageSize: 20,
          page: 1,
          qf: ['type:Collection']
        }, { withMinimalItemPreviews: true }
      )).toBe(true);
    });

    it('stores sets and total', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.sets).toEqual(sets);
      expect(wrapper.vm.total).toBe(2);
    });
  });

  describe('methods', () => {
    describe('handleSetCreated', () => {
      it('goes back to page 1 if not already there', () => {
        const $route = {
          path: '/en/account',
          hash: '#public-galleries',
          query: { page: 2 }
        };
        const wrapper = factory({ $route });

        wrapper.vm.handleSetCreated();

        expect(wrapper.vm.$router.push.calledWith({
          path: '/en/account',
          query: { page: 1 },
          hash: '#public-galleries'
        })).toBe(true);
      });

      it('triggers $fetch if already on page 1', () => {
        const $route = {
          path: '/en/account',
          hash: '#public-galleries',
          query: { page: 1 }
        };
        const wrapper = factory({ $route });
        sinon.spy(wrapper.vm, '$fetch');

        wrapper.vm.handleSetCreated();

        expect(wrapper.vm.$router.push.called).toBe(false);
        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });
});
