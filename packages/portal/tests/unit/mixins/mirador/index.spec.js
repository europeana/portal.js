import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';
import { shallowMountNuxt } from '../../utils';

import mixin from '@/mixins/mirador/index.js';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ data = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  data() {
    return {
      ...data
    };
  },
  mocks: {
    $i18n: {
      locale: 'en'
    }
  }
});

const mockMiradorViewer = {
  unmount: sinon.spy(),
  store: {
    dispatch: sinon.stub(),
    getState: sinon.stub().returns({
      windows: { '001': {} },
      companionWindows: ['companionWindowId001']
    }),
    subscribe: sinon.stub()
  }
};

const mockMirador = {
  viewer: sinon.stub().returns(mockMiradorViewer),
  actions: {
    fetchSearch: sinon.stub(),
    setWindowThumbnailPosition: sinon.stub(),
    updateWindow: sinon.stub()
  }
};

const miradorManifestUri = 'https://iiif.example.org/123/manifest';

describe('mixins/mirador/index.js', () => {
  beforeAll(() => {
    process.client = true;
    window.Mirador = mockMirador;
    sinon.spy(document.head, 'appendChild');
  });

  afterEach(sinon.resetHistory);

  afterAll(() => {
    delete process.client;
    delete window.Mirador;
    sinon.restore();
  });

  describe('beforeDestroy', () => {
    it('unmounts the Mirador viewer instance', () => {
      const wrapper = factory({ data: { miradorManifestUri } });

      wrapper.destroy();

      expect(mockMiradorViewer.unmount.called).toBe(true);
    });
  });

  describe('methods', () => {
    describe('loadMirador', () => {
      describe('when Mirador is not yet loaded', () => {
        const data = { isMiradorLoaded: false };

        it('loads Mirador by appending script tag to document head', () => {
          const wrapper = factory({ data });

          expect(document.head.appendChild.called).toBe(true);
          expect(wrapper.vm.isMiradorLoaded).toBe(true);
        });
      });
    });
  });
});
