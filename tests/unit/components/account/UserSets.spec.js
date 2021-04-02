import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserSets from '../../../../src/components/account/UserSets.vue';

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

const factory = () => mount(UserSets, {
  localVue,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $fetchState: {},
    $apis: {
      set: {
        getSetThumbnail: () => null
      }
    },
    $store: {
      state: {
        set: {
          creations: sets
        }
      }
    },
    $t: (key) => key,
    $tc: (key) => key,
    $path: () => 'localizedPath'
  }
});

describe('components/account/UserSets', () => {
  it('renders a card for every user set', () => {
    const wrapper = factory();

    const renderedSets =  wrapper.findAll('[data-qa="user set"]');

    renderedSets.at(0).find('[data-qa="card title"]').text().should.equal('A new collection');
    renderedSets.at(1).find('[data-qa="card title"]').text().should.equal('A second collection');
  });
});
