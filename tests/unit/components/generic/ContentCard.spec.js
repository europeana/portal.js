import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';
import ContentCard from '@/components/generic/ContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component('SmartLink', SmartLink);

const $store = {
  state: {
    request: {
      domain: null
    }
  }
};

const factory = () => mount(ContentCard, {
  localVue,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $i18n: {
      locale: 'en'
    },
    $path: () => '',
    $t: (key) => {
      if (key === 'formatting.ellipsis') {
        return '…';
      } else if (key === 'formatting.listSeperator') {
        return ';';
      } else {
        return key;
      }
    },
    $tc: (key) => key,
    $store
  }
});

describe('components/generic/ContentCard', () => {
  describe('card title', () => {
    it('is displayed as-is if a string', async() => {
      const wrapper = factory();
      await wrapper.setProps({ title: 'The Milkmaid by Vermeer' });

      const title =  wrapper.find('[data-qa="content card"] .card-title');
      expect(title.text()).toBe('The Milkmaid by Vermeer');
    });

    it('is localised if a LangMap', async() => {
      const wrapper = factory();
      await wrapper.setProps({ title: { en: 'Art', es: 'Arte' } });

      const title =  wrapper.find('[data-qa="content card"] .card-title');
      expect(title.text()).toBe('Art');
    });
  });

  describe('card subtitle', () => {
    const tests = [
      {
        type: 'blog',
        urls: [
          'https://blog.europeana.eu/2019/11/vespa-and-piaggio-icons-of-italian-industrial-design/',
          'https://www.europeana.eu/en/blog/introducing-the-new-europeana-demo',
          { name: 'blog___en', params: { pathMatch: 'introducing-the-new-europeana-demo' } }
        ]
      },
      {
        type: 'exhibitions',
        urls: [
          'https://www.europeana.eu/en/exhibitions/pioneers',
          { name: 'exhibitions___en', params: { exhibition: 'pioneeers' } }
        ]
      },
      {
        type: 'galleries',
        urls: [
          'https://www.europeana.eu/en/galleries/board-games',
          { name: 'galleries___en', params: { pathMatch: 'board-games' } }
        ]
      },
      {
        type: 'collections',
        urls: [
          'https://www.europeana.eu/en/collections/topic/207-byzantine-art',
          { name: 'collections___en', params: { type: 'topic' } }
        ]
      },
      {
        type: 'collections',
        urls: [
          'https://www.europeana.eu/en/collections/topic/83-world-war-i',
          { name: 'collections___en', params: { type: 'topic', pathMatch: '83' } }
        ]
      }
    ];

    for (const test of tests) {
      describe(`for ${test.type}`, () => {
        for (const url of test.urls) {
          it(`is shown for ${JSON.stringify(url)}`, async() => {
            const wrapper = factory();
            await wrapper.setProps({ url });

            const subtitle =  wrapper.find('[data-qa="content card"] .card-subtitle');
            if (test.type === 'collections') {
              if (wrapper.vm.themes.some(theme => (typeof url === 'string' && url.includes(theme))
              || theme === url.params?.pathMatch)) {
                // TO DO remove when thematic collections topics get there own 'theme' type
                expect(subtitle.text()).toBe('cardLabels.theme');
              } else {
                expect(subtitle.text()).toBe(`cardLabels.${test.urls[1].params.type}`);
              }
            } else if (test.type === 'blog') {
              expect(subtitle.text()).toBe('blog.posts');
            } else {
              expect(subtitle.text()).toBe(`${test.type}.${test.type}`);
            }
          });
        }
      });
    }
  });

  describe('card body', () => {
    it('displays the texts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ texts: ['The Milkmaid by Vermeer'] });

      const body =  wrapper.find('[data-qa="content card"] .card-body');
      expect(body.text()).toBe('The Milkmaid by Vermeer');
    });

    it('localises LangMap texts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ texts: [{ en: 'Art', es: 'Arte' }] });

      const body =  wrapper.find('[data-qa="content card"] .card-body');
      expect(body.text()).toBe('Art');
    });

    it('truncates long texts', async() => {
      const wrapper = factory();
      await wrapper.setProps({ texts: [
        '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
      ] });

      const body =  wrapper.find('[data-qa="content card"] .card-body');
      expect(body.text().length).toBe(256);
      expect(body.text().endsWith('…')).toBe(true);
    });

    it('optionally limits number of values per text to display', async() => {
      const wrapper = factory();
      await wrapper.setProps({ texts: [['A', 'B', 'C', 'D', 'E', 'F']], limitValuesWithinEachText: 3 });

      const body =  wrapper.find('[data-qa="content card"] .card-body');
      expect(body.text()).toBe('A; B; C; …');
    });

    it('has a creator and institution', async() => {
      const wrapper = factory();
      await wrapper.setProps({ texts: ['Edvard Munch', 'Munchmuseet (The Munch Museum)'] });

      const body =  wrapper.find('[data-qa="content card"] .card-body');
      expect(body.text()).toContain('Edvard Munch');
      expect(body.text()).toContain('Munchmuseet');
    });
  });

  describe('card link', () => {
    it('may have a link', async() => {
      const wrapper = factory();
      await wrapper.setProps({ url: 'https://example.org' });

      const link =  wrapper.find('[data-qa="content card"] .card-link');
      expect(link.attributes().href).toBe('https://example.org');
    });
  });

  describe('card image', () => {
    it('may have an image', async() => {
      const wrapper = factory();
      await wrapper.setProps({ imageUrl: 'https://example.org' });

      const image =  wrapper.find('[data-qa="content card"] .card-img img');
      expect(image).toBeDefined();
      expect(image.attributes('src')).toBe('https://example.org');
    });

    it('may have an optimised image', async() => {
      const wrapper = factory();
      await wrapper.setProps({ imageUrl: '//images.ctfassets.net/example/example.jpg', imageContentType: 'image/jpeg' });

      expect(wrapper.vm.optimisedImageUrl).toContain('fm=jpg&fl=progressive&q=50');
    });

    it('may have an optimised image with max width', async() => {
      const wrapper = factory();
      await wrapper.setProps({
        imageUrl: '//images.ctfassets.net/example/example.jpg',
        imageContentType: 'image/jpeg',
        imageOptimisationOptions: { width: 510 }
      });

      expect(wrapper.vm.optimisedImageUrl).toContain('fm=jpg&fl=progressive&q=50&w=510');
    });

    it('may have no image and is of variant mini', async() => {
      const wrapper = factory();
      await wrapper.setProps({ imageUrl: null, variant: 'mini' });

      const image =  wrapper.find('[data-qa="content card"] .card-img');
      expect(image.exists()).toBe(false);
    });

    it('may have an image and is of variant mini', async() => {
      const wrapper = factory();
      await wrapper.setProps({ imageUrl: 'https://example.org', variant: 'mini' });

      const image =  wrapper.find('[data-qa="content card"] .card-img');
      expect(image.exists()).toBe(true);
    });

    it('removes the image if the image media is not found', async() => {
      const wrapper = factory();
      await wrapper.setProps({ imageUrl: 'https://example.org', variant: 'mini' });

      let image = wrapper.find('[data-qa="content card"] .card-img img');
      expect(image.exists()).toBe(true);
      await image.trigger('error');

      image = wrapper.find('[data-qa="content card"] .card-img img');
      expect(image.exists()).toBe(false);
    });
  });

  describe('highlighted search term', () => {
    it('highlights the search term if found', async() => {
      const wrapper = factory();
      await wrapper.setProps({
        hitsText: {
          prefix: 'The quick brown ',
          exact: 'fox',
          suffix: ' jumps over the lazy dog'
        }
      });

      const body =  wrapper.find('[data-qa="highlighted search term"] strong');
      expect(body.text()).toBe('fox');
    });
  });
});
