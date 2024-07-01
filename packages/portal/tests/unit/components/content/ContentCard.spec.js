import sinon from 'sinon';
import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SmartLink from '@/components/generic/SmartLink.vue';
import ContentCard from '@/components/content/ContentCard.vue';

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

const factory = ({ propsData, mocks } = {}) => mount(ContentCard, {
  attachTo: document.body,
  localVue,
  propsData,
  mocks: {
    $config: { app: { internalLinkDomain: null } },
    $contentful: {
      assets: {
        isValidUrl: (url) => url.includes('images.ctfassets.net'),
        optimisedSrc: sinon.spy((img) => `${img.url}?optimised`)
      }
    },
    $i18n: {
      locale: 'en'
    },
    localePath: () => '',
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
    $store,
    ...mocks
  }
});

describe('components/content/ContentCard', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('card title', () => {
      it('is displayed as-is if a string', async() => {
        const wrapper = factory();
        await wrapper.setProps({ title: 'The Milkmaid by Vermeer' });

        const title = wrapper.find('[data-qa="content card"] .card-title');
        expect(title.text()).toBe('The Milkmaid by Vermeer');
      });

      it('is localised if a LangMap', async() => {
        const wrapper = factory();
        await wrapper.setProps({ title: { en: 'Art', es: 'Arte' } });

        const title = wrapper.find('[data-qa="content card"] .card-title');
        expect(title.text()).toBe('Art');
      });
    });

    describe('card subtitle', () => {
      describe('for blog', () => {
        const urls = [
          'https://blog.europeana.eu/2019/11/vespa-and-piaggio-icons-of-italian-industrial-design/',
          'https://www.europeana.eu/en/blog/introducing-the-new-europeana-demo',
          { name: 'blog___en', params: { pathMatch: 'introducing-the-new-europeana-demo' } }
        ];

        for (const url of urls) {
          it(`is shown for ${JSON.stringify(url)}`, async() => {
            const wrapper = factory();
            await wrapper.setProps({ url });

            const subtitle = wrapper.find('[data-qa="content card"] .card-subtitle');

            expect(subtitle.text()).toBe('stories.stories');
          });
        }
      });

      describe('for exhibitions', () => {
        const urls = [
          'https://www.europeana.eu/en/exhibitions/pioneers',
          { name: 'exhibitions___en', params: { exhibition: 'pioneeers' } }
        ];

        for (const url of urls) {
          it(`is shown for ${JSON.stringify(url)}`, async() => {
            const wrapper = factory();
            await wrapper.setProps({ url });

            const subtitle = wrapper.find('[data-qa="content card"] .card-subtitle');

            expect(subtitle.text()).toBe('exhibitions.exhibitions');
          });
        }
      });

      describe('for galleries', () => {
        const urls = [
          'https://www.europeana.eu/en/galleries/board-games',
          { name: 'galleries___en', params: { pathMatch: 'board-games' } }
        ];

        for (const url of urls) {
          it(`is shown for ${JSON.stringify(url)}`, async() => {
            const wrapper = factory();
            await wrapper.setProps({ url });

            const subtitle = wrapper.find('[data-qa="content card"] .card-subtitle');

            expect(subtitle.text()).toBe('galleries.galleries');
          });
        }
      });

      describe('for collections', () => {
        const urls = [
          'https://www.europeana.eu/en/collections/topic/207-byzantine-art',
          { name: 'collections___en', params: { type: 'topic' } }
        ];

        for (const url of urls) {
          it(`is shown for ${JSON.stringify(url)}`, async() => {
            const wrapper = factory();
            await wrapper.setProps({ url });

            const subtitle = wrapper.find('[data-qa="content card"] .card-subtitle');

            expect(subtitle.text()).toBe('cardLabels.topic');
          });
        }
      });
    });

    describe('card body', () => {
      it('displays the texts', async() => {
        const wrapper = factory();
        await wrapper.setProps({ texts: ['The Milkmaid by Vermeer'] });

        const body = wrapper.find('[data-qa="content card"] .card-body');
        expect(body.text()).toBe('The Milkmaid by Vermeer');
      });

      it('localises LangMap texts', async() => {
        const wrapper = factory();
        await wrapper.setProps({ texts: [{ en: 'Art', es: 'Arte' }] });

        const body = wrapper.find('[data-qa="content card"] .card-body');
        expect(body.text()).toBe('Art');
      });

      it('truncates long texts', async() => {
        const wrapper = factory();
        await wrapper.setProps({ texts: [
          '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
        ] });

        const body = wrapper.find('[data-qa="content card"] .card-body');
        expect(body.text().length).toBe(256);
        expect(body.text().endsWith('…')).toBe(true);
      });

      it('optionally limits number of values per text to display', async() => {
        const wrapper = factory();
        await wrapper.setProps({ texts: [['A', 'B', 'C', 'D', 'E', 'F']], limitValuesWithinEachText: 3 });

        const body = wrapper.find('[data-qa="content card"] .card-body');
        expect(body.text()).toBe('A; B; C; …');
      });

      it('has a creator and institution', async() => {
        const wrapper = factory();
        await wrapper.setProps({ texts: ['Edvard Munch', 'Munchmuseet (The Munch Museum)'] });

        const body = wrapper.find('[data-qa="content card"] .card-body');
        expect(body.text()).toContain('Edvard Munch');
        expect(body.text()).toContain('Munchmuseet');
      });
    });

    describe('card link', () => {
      it('may have a link', async() => {
        const wrapper = factory();
        await wrapper.setProps({ url: 'https://example.org' });

        const link = wrapper.find('[data-qa="content card"] .card-link');
        expect(link.attributes().href).toBe('https://example.org');
      });
    });

    describe('card image', () => {
      it('may have an image', async() => {
        const wrapper = factory();
        await wrapper.setProps({ imageUrl: 'https://example.org' });

        const image = wrapper.find('[data-qa="content card"] .card-img img');
        expect(image).toBeDefined();
        expect(image.attributes('src')).toBe('https://example.org');
      });

      it('may have an optimised image, if for Contentful asset', () => {
        const wrapper = factory({ propsData: {
          imageUrl: 'https://images.ctfassets.net/example/example.jpg',
          imageContentType: 'image/jpeg',
          imageOptimisationOptions: { width: 510 }
        } });

        expect(wrapper.vm.optimisedImageUrl).toContain('?optimised');
        expect(wrapper.vm.$contentful.assets.optimisedSrc.calledWith({
          url: 'https://images.ctfassets.net/example/example.jpg',
          contentType: 'image/jpeg'
        },
        { w: 510, h: undefined, fit: undefined, f: undefined })).toBe(true);
      });

      it('may have no image and is of variant mini', async() => {
        const wrapper = factory();
        await wrapper.setProps({ imageUrl: null, variant: 'mini' });

        const image = wrapper.find('[data-qa="content card"] .card-img');
        expect(image.exists()).toBe(false);
      });

      it('may have an image and is of variant mini', async() => {
        const wrapper = factory();
        await wrapper.setProps({ imageUrl: 'https://example.org', variant: 'mini' });

        const image = wrapper.find('[data-qa="content card"] .card-img');
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
      it('highlights the search term', async() => {
        const wrapper = factory();
        await wrapper.setProps({
          hitText: {
            prefix: 'The quick brown ',
            exact: 'fox',
            suffix: ' jumps over the lazy dog'
          }
        });

        const body = wrapper.find('[data-qa="highlighted search term"] strong');
        expect(body.text()).toBe('fox');
      });

      it('limits the hit prefix and suffix word count if needed', () => {
        const wrapper = factory({ propsData: {
          hitText: {
            prefix: 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen ',
            exact: 'fox',
            suffix: ' sixteen fifteen fourteen thirteen twelve eleven ten nine eight seven six five four three two one'
          }
        } });

        const body = wrapper.find('[data-qa="highlighted search term"]');

        expect(body.text()).toBe('three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen fox sixteen fifteen fourteen thirteen twelve eleven ten nine eight seven six five four three');
      });
    });

    describe('when the card variant is mosaic', () => {
      const wrapper = factory({ propsData: {
        variant: 'mosaic'
      } });

      describe('and there is a title and texts available', () => {
        it('there is a tooltip title', async() => {
          await wrapper.setProps({ title: 'Work of art',
            texts: ['Museum'] });

          const tooltipTitle = wrapper.vm.tooltipTitle;
          expect(tooltipTitle).toEqual('Work of art - Museum');
        });
      });

      describe('and there is a title available', () => {
        it('there is a tooltip title', async() => {
          await wrapper.setProps({ title: 'Work of art', texts: [] });

          const tooltipTitle = wrapper.vm.tooltipTitle;
          expect(tooltipTitle).toEqual('Work of art');
        });
      });

      describe('and there are texts available', () => {
        it('there is a tooltip title', async() => {
          await wrapper.setProps({ title: null, texts: ['Museum', 'Europe'] });

          const tooltipTitle = wrapper.vm.tooltipTitle;
          expect(tooltipTitle).toEqual('Museum - Europe');
        });
      });
    });
  });

  describe('methods', () => {
    describe('imageNotFound', () => {
      it('sets cardImageUrl to blank string', () => {
        const imageUrl = 'http://example.org/image.jpeg';
        const wrapper = factory({ propsData: { imageUrl } });

        expect(wrapper.vm.cardImageUrl).toBe(imageUrl);
        wrapper.vm.imageNotFound();

        expect(wrapper.vm.cardImageUrl).toBe('');
      });

      it('redraws Masonry layout', async() => {
        const wrapper = factory({ mocks: { $redrawVueMasonry: sinon.spy() } });

        await wrapper.vm.imageNotFound();

        expect(wrapper.vm.$redrawVueMasonry.called).toBe(true);
      });
    });

    describe('imageLoaded', () => {
      describe('when event target src is a data: placeholder', () => {
        const loadEvent = { target: { src: 'data:image/svg+xml;...' } };

        it('does not redraw Masonry layout', async() => {
          const wrapper = factory({ mocks: { $redrawVueMasonry: sinon.spy() } });

          await wrapper.vm.imageLoaded(loadEvent);

          expect(wrapper.vm.$redrawVueMasonry.called).toBe(false);
        });
      });

      describe('when event target src is not a data: placeholder', () => {
        const loadEvent = { target: { src: 'http://example.org/image.jpeg' } };

        it('redraws Masonry layout', async() => {
          const wrapper = factory({ mocks: { $redrawVueMasonry: sinon.spy() } });

          await wrapper.vm.imageLoaded(loadEvent);

          expect(wrapper.vm.$redrawVueMasonry.called).toBe(true);
        });
      });
    });
  });
});
