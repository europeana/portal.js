import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/microsite/DS4CH.eu';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({
  $route = { params: {}, query: {} }, data = {}, contentfulQueryResponse = { data: { data: {} } }
} = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $fetchState: {},
    $i18n: { isoLocale: () => 'en-GB' },
    $error: sinon.spy(),
    $route,
    $t: key => key
  }
});

describe('DS4CHPage', () => {
  describe('fetch', () => {
    it('fetches the content from Contentful', async() => {
      const page = { headline: 'Welcome to the DS4CH' };
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { landingPageCollection: { items: [page] } } } }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('browseLandingStaticPage', {
        identifier: 'microsite/DS4CH.eu',
        locale: 'en-GB',
        preview: false
      })).toBe(true);
      expect(wrapper.vm.page).toEqual(page);
    });

    it('detects no DS4CH.eu page and throws 404', async() => {
      process.server = true;
      const slug = 'not-found';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { landingPageCollection: { items: [] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.page).toEqual({});
      expect(wrapper.vm.$error.calledWith(404)).toBe(true);
    });
  });
});
