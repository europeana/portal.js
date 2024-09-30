import nock from 'nock';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import MediaAnnotationList from '@/components/media/MediaAnnotationList.vue';

const localVue = createLocalVue();

const factory = ({ propsData } = {}) => shallowMountNuxt(MediaAnnotationList, {
  propsData,
  mocks: {
    $fetchState: {}
  },
  localVue,
  stubs: ['b-list-group', 'b-list-group-item']
});

describe('components/media/MediaAnnotationList', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('fetch', () => {
    const origin = 'https://iiif.europeana.eu';
    const targetId = `${origin}/canvas/1`;
    const bodyPath = '/fulltext/1';
    const bodyUri = `${origin}${bodyPath}`;
    const bodyResponseData = {
      id: bodyUri,
      type: 'TextualBody',
      value: 'full text'
    };
    const listPath = '/annos/1';
    const listUri = `${origin}${listPath}`;
    const listResponseData = {
      id: listUri,
      type: 'AnnotationPage',
      items: [{
        type: 'Annotation',
        body: {
          id: bodyUri
        },
        target: [{
          id: targetId
        }]
      }]
    };
    const textGranularity = 'line';

    beforeEach(() => {
      nock(origin).get(listPath).query({ textGranularity }).reply(200, listResponseData);
      nock(origin).get(bodyPath).reply(200, bodyResponseData);
    });

    it('fetches annotation list w/ text granularity and embeds bodies', async() => {
      const wrapper = factory({ propsData: { uri: listUri, targetId, textGranularity } });

      await wrapper.vm.fetch();

      expect(nock.isDone()).toBe(true);
    });

    it('stores relevant annotations', async() => {
      const wrapper = factory({ propsData: { uri: listUri, targetId, textGranularity } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.annotations).toEqual([
        {
          body: {
            id: 'https://iiif.europeana.eu/fulltext/1',
            value: 'full text'
          },
          target: [{ id: 'https://iiif.europeana.eu/canvas/1' }]
        }
      ]);
    });
  });
});
