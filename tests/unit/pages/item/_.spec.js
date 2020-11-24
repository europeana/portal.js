import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '../../../../pages/item/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(page, {
  localVue,
  data() {
    return {
      identifier: '/123/abc'
    };
  },
  mocks: {
    $pageHeadTitle: key => key,
    $t: key => key,
    $auth: {
      loggedIn: false
    },
    $store: {
      getters: {
        'apis/annotation': {
          search: sinon.spy()
        },
        'apis/entity': {
          findEntities: sinon.spy()
        },
        'api/record': {
          getRecord: sinon.stub().resolves({}),
          search: sinon.spy()
        },
        'set/isLiked': sinon.stub()
      }
    }
  }
});

describe('pages/item/_.vue', () => {
  describe('head()', () => {
    it('uses first media large thumbnail for og:image', () => {
      const thumbnailUrl = 'http://example.org/image/large.jpg';
      const wrapper = factory();
      wrapper.setData({
        media: [
          {
            thumbnails: {
              large: thumbnailUrl
            }
          }
        ]
      });
      wrapper.vm.head = page.head;

      const headMeta = wrapper.vm.head().meta;

      headMeta.find(meta => meta.property === 'og:image').content.should.eq(thumbnailUrl);
    });
  });
});
