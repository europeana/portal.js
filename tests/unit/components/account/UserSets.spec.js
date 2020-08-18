import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import UserSets from '../../../../components/account/UserSets.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(UserSets, {
  localVue,
  mocks: {
    $fetchState: {},
    $sets: {
      getSetThumbnail: () => null
    },
    $t: (key) => key,
    $tc: (key) => key,
    $path: () => 'localizedPath'
  }
});

const sets = [
  {
    id: '1',
    type: 'Collection',
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
    title: 'A second collection'
  }
];

describe('components/account/UserSets', () => {
  it('renders a card for every user set', () => {
    const wrapper = factory();

    wrapper.setData({
      userSets: sets
    });

    const renderedSets =  wrapper.findAll('[data-qa="user set"]');
    renderedSets.at(0).find('[data-qa="card title"]').text().should.equal('A new collection');
    renderedSets.at(1).find('[data-qa="card title"]').text().should.equal('A second collection');
  });

  describe('fetch()', () => {
    // FIXME: $fetch() and fetch() do not exist on `wrapper.vm` under @vue/test-utils v1.0.0-beta.29
    it('searches the Set API');
  });
});
