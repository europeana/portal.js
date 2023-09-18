import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import page from '@/pages/media/index';

const localVue = createLocalVue();

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $apis: {
      iiifPresentation: {
        baseURL: 'https://iiifpresentation.eanadev.org/'
      },
      record: {
        baseURL: 'https://api.eanadev.org/record'
      }
    },
    $route: {
      query: {
        id: '/123/Identifier_456',
        mediaUrl: 'https//example.com/media',
        mediaType: data.mediaType || 'video/mpeg'
      }
    },
    $t: key => key
  }
});

describe('pages/media/index', () => {
  beforeAll(() => {
    // global stubbed media player constructor to quiet warnings
    EuropeanaMediaPlayer = function() {
      return {};
    };
  });

  afterAll(() => {
    EuropeanaMediaPlayer = undefined;
  });

  describe('computed', () => {
    describe('manifest', () => {
      it('includes params for the recordApi and format', () => {
        const wrapper = factory();

        expect(wrapper.vm.manifest).toBe('https://iiifpresentation.eanadev.org/presentation/123/Identifier_456/manifest?format=3&recordApi=https%3A%2F%2Fapi.eanadev.org');
      });
    });

    describe('dashRequired', () => {
      describe('when the WebResource requiers Dash JS', () => {
        it('is true', () => {
          const wrapper = factory({ data: {  mediaType: 'application/dash+xml' } });

          expect(wrapper.vm.dashRequired).toBe(true);
        });
      });

      describe('when the WebResource does NOT require Dash JS', () => {
        it('is false', () => {
          const wrapper = factory();

          expect(wrapper.vm.dashRequired).toBe(false);
        });
      });
    });
  });
});
