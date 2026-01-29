import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/exhibitions/_exhibition/credits';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data: () => ({ ...data }),
  mocks: {
    $t: (key) => key,
    $tc: (key) => key,
    $config: {
      app: {
        baseUrl: 'https://www.europeana.eu'
      }
    },
    localePath: () => '/'
  },
  stubs: [
    'EntityBadges',
    'LinkList',
    'ThemeBadges'
  ]
});

describe('pages/exhibitions/_exhibition/credits', () => {
  describe('template', () => {
    it('displays credits, rendered from Markdown', () => {
      const data = {
        credits: '**Important**'
      };
      const wrapper = factory({ data });

      const creditsHtml = wrapper.find('[data-qa="credits text"]').html();

      expect(creditsHtml.includes('<p><strong>Important</strong></p>')).toBe(true);
    });
  });

  describe('pageMeta', () => {
    const data = {
      name: 'Exhibition of things'
    };

    it('has title of exhibition, plus "credits" (translated)', () => {
      const wrapper = factory({ data });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.title).toBe('Exhibition of things - exhibitions.credits');
    });

    it('has og:type article', () => {
      const wrapper = factory({ data });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogType).toBe('article');
    });
  });
});
