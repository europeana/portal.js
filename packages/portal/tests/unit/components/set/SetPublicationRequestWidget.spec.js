import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetPublicationRequestWidget from '@/components/set/SetPublicationRequestWidget';
import nock from 'nock';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testSet =
  {
    id: '001',
    items: ['http://data.europeana.eu/item/000/aaa'],
    title: { en: 'Test set' },
    total: 1,
    visibility: 'public',
    creator: { nickname: 'user1' }
  };

const userEmailMock = 'user@example.eu';

const factory = (propsData = {}) => shallowMount(SetPublicationRequestWidget, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
    $i18n: {},
    $path: (args) => args,
    $store: {
      state: {
        auth: {
          user: {
            email: userEmailMock
          }
        }
      }
    },
    $t: () => {}

  },
  stubs: ['i18n']
});

describe('components/set/SetPublicationRequestWidget', () => {
  describe('submitForPublication', () => {
    it('submits set for publication', async() => {
      const baseUrl = 'http://www.example.org';
      nock(baseUrl).post('/_api/jira-service-desk/galleries', {
        setTitle: 'Test set',
        setId: '001',
        setCreatorNickname: 'user1',
        email: 'user@example.eu'
      }
      ).reply(201);

      const wrapper = factory({ set: testSet });
      wrapper.vm.$config = { app: { baseUrl } };

      await wrapper.vm.submitForPublication();

      expect(nock.isDone()).toBe(true);
    });
  });
});
