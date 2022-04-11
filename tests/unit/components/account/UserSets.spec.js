import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserSets from '@/components/account/UserSets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const sets = [
  {
    id: '1',
    type: 'Collection',
    visibility: 'public',
    title: 'A new collection',
    description: 'A description',
    items: [
      {
        edmPreview: ['http://www.example.org/image.jpg']
      }
    ],
    total: 1
  },
  {
    id: '2',
    type: 'Collection',
    visibility: 'public',
    title: 'A second collection'
  }
];

const factory = (propsData) => mount(UserSets, {
  localVue,
  propsData,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $fetchState: {},
    $apis: {
      set: {
        getSetThumbnail: () => null
      }
    },
    $t: (key) => key,
    $tc: (key) => key,
    $path: () => 'localizedPath',
    $i18n: { locale: 'en' },
    $store: {
      getters: {
        'set/creationPreview': (id) => id
      }
    }
  }
});

describe('components/account/UserSets', () => {
  it('renders a card for every user set', () => {
    const wrapper = factory({ sets });

    const renderedSets =  wrapper.findAll('[data-qa="user set"]');

    expect(renderedSets.at(0).find('[data-qa="card title"]').text()).toBe('A new collection');
    expect(renderedSets.at(1).find('[data-qa="card title"]').text()).toBe('A second collection');
  });
});
