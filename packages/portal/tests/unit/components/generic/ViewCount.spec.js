import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import nock from 'nock';

import BootstrapVue from 'bootstrap-vue';
import ViewCount from '@/components/generic/ViewCount.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const apiResponse = {
  viewCount: 5
};
const baseUrl = 'http://www.example.org';

const createContainer = (tag = 'div') => {
  const container = document.createElement(tag);
  document.body.appendChild(container);

  return container;
};

const factory = ({ propsData = {} }) => {
  return mountNuxt(ViewCount, {
    attachTo: createContainer(),
    localVue,
    propsData,
    mocks: {
      $config: {
        app: {
          baseUrl
        }
      },
      $n: (num) => num,
      $t: (key) => key,
      $tc: (key, count) => `${key} ${count}`,
      $features: { storiesViewCounts: true }
    }
  });
};

describe('components/generic/ViewCount', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('when passed a URL', () => {
    const url = 'https://www.europeana.eu/story/example';

    beforeEach(() => {
      nock(baseUrl)
        .get('/_api/events/views')
        .query(query => query.url === url)
        .reply(200, apiResponse);
    });
    const propsData = { url };

    it('fetches view count for URL from local API', async() => {
      const wrapper = factory({ propsData });
      await wrapper.vm.fetch();

      expect(nock.isDone()).toBe(true);
    });

    it('renders view counter', async() => {
      const wrapper = factory({ propsData });
      await wrapper.vm.fetch();

      const viewCounter = wrapper.find('[data-qa="view count"]');
      expect(nock.isDone()).toBe(true);
      expect(viewCounter.text()).toBe('views.count 5');
    });
  });
});
