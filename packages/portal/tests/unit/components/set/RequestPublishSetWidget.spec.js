import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RequestPublishSetWidget from '@/components/set/RequestPublishSetWidget';
import nock from 'nock';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const testSet =
  {
    id: '001',
    items: ['http://data.europeana.eu/item/000/aaa'],
    title: 'Test set',
    total: 1,
    visibility: 'public',
    creator: { nickname: 'user1' }
  };

const userEmailMock = 'user@example.eu';

const factory = (propsData = {}) => shallowMount(RequestPublishSetWidget, {
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
            email: userEmailMock,
            'email_verified': true
          }
        }
      }
    },
    $t: () => {}

  },
  stubs: ['i18n']
});

describe('components/set/RequestPublishSetWidget', () => {
  describe('submitForPublication', () => {
    it('submits set for publication', async() => {
      const baseUrl = 'http://www.example.org';
      nock(baseUrl).post('/_api/jira/gallery-publication', body => (
        (body.submission === `Set ID: ${testSet.id}\
        Set creator: ${testSet.creator.nickname}`) && (body.email === userEmailMock)
      )).reply(201);

      const wrapper = factory({ set: testSet });
      wrapper.vm.$config = { app: { baseUrl } };

      await wrapper.vm.submitForPublication();

      expect(nock.isDone()).toBe(true);
    });
  });
});
