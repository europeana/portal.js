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
    $t: (key) => key,
    $tc: (key) => key,
    $store
  }
});

describe('components/generic/ContentCard', () => {
  it('has a description', async() => {
    const wrapper = factory();
    await wrapper.setProps({ texts: ['The Milkmaid by Vermeer'] });

    const description =  wrapper.find('[data-qa="content card"] .card-body');
    expect(description.text()).toBe('The Milkmaid by Vermeer');
  });

  describe('display labels', () => {
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

            const label =  wrapper.find('[data-qa="content card"] .card-subtitle');
            if (test.type === 'collections') {
              if (wrapper.vm.themes.some(theme => (typeof url === 'string' && url.includes(theme))
              || theme === url.params?.pathMatch)) {
                // TO DO remove when thematic collections topics get there own 'theme' type
                expect(label.text()).toBe('cardLabels.theme');
              } else {
                expect(label.text()).toBe(`cardLabels.${test.urls[1].params.type}`);
              }
            } else if (test.type === 'blog') {
              expect(label.text()).toBe('blog.posts');
            } else {
              expect(label.text()).toBe(`${test.type}.${test.type}`);
            }
          });
        }
      });
    }
  });

  it('has a creator and institution', async() => {
    const wrapper = factory();
    await wrapper.setProps({ texts: ['Edvard Munch', 'Munchmuseet (The Munch Museum)'] });

    const description =  wrapper.find('[data-qa="content card"] .card-body');
    expect(description.text()).toContain('Edvard Munch');
    expect(description.text()).toContain('Munchmuseet');
  });

  it('has a link', async() => {
    const wrapper = factory();
    await wrapper.setProps({ url: 'https://example.org' });

    const link =  wrapper.find('[data-qa="content card"] .card-link');
    expect(link.attributes().href).toBe('https://example.org');
  });

  it('has an image', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: 'https://example.org' });

    const card =  wrapper.find('[data-qa="content card"] .card-img img');
    expect(card).exist;
  });

  it('has an optimised image', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: '//images.ctfassets.net/example/example.jpg', imageContentType: 'image/jpeg' });

    expect(wrapper.vm.optimisedImageUrl).toContain('fm=jpg&fl=progressive&q=50');
  });

  it('has an optimised image with max width', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      imageUrl: '//images.ctfassets.net/example/example.jpg',
      imageContentType: 'image/jpeg',
      imageOptimisationOptions: { width: 510 }
    });

    expect(wrapper.vm.optimisedImageUrl).toContain('fm=jpg&fl=progressive&q=50&w=510');
  });

  it('has no image and is of variant mini', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: null, variant: 'mini' });

    const image =  wrapper.find('[data-qa="content card"] .card-img');
    expect(image.exists()).toBe(false);
  });

  it('has has an image and is of variant mini', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: 'https://example.org', variant: 'mini' });

    const image =  wrapper.find('[data-qa="content card"] .card-img');
    expect(image.exists());
  });

  it('highlights the search term if found', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      hitsText: {
        prefix: 'The quick brown ',
        exact: 'fox',
        suffix: ' jumps over the lazy dog'
      }
    });

    const description =  wrapper.find('[data-qa="highlighted search term"] strong');
    expect(description.text()).toBe('fox');
  });
});
