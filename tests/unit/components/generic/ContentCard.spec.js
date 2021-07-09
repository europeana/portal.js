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
    description.text().should.eq('The Milkmaid by Vermeer');
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
              label.text().should.eq(`cardLabels.${test.urls[1].params.type}`);
            } else if (test.type === 'blog') {
              label.text().should.eq('blog.posts');
            } else {
              label.text().should.eq(`${test.type}.${test.type}`);
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
    description.text().should.contain('Edvard Munch');
    description.text().should.contain('Munchmuseet');
  });

  it('has a link', async() => {
    const wrapper = factory();
    await wrapper.setProps({ url: 'https://example.org' });

    const link =  wrapper.find('[data-qa="content card"] .card-link');
    link.attributes().href.should.eq('https://example.org');
  });

  it('has an image', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: 'https://example.org' });

    const card =  wrapper.find('[data-qa="content card"] .card-img img');
    card.should.exist;
  });

  it('has an optimised image', async() => {
    const wrapper = factory();
    await wrapper.setProps({ imageUrl: '//images.ctfassets.net/example/example.jpg', imageContentType: 'image/jpeg' });

    wrapper.vm.optimisedImageUrl.should.contain('fm=jpg&fl=progressive&q=50');
  });

  it('has an optimised image with max width', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      imageUrl: '//images.ctfassets.net/example/example.jpg',
      imageContentType: 'image/jpeg',
      imageOptimisationOptions: { width: 510 }
    });

    wrapper.vm.optimisedImageUrl.should.contain('fm=jpg&fl=progressive&q=50&w=510');
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

    const description =  wrapper.find('[data-qa="highlighted search term"] p');
    description.html().should.contain('<p>The quick brown <strong class="has-text-highlight">fox</strong> jumps over the lazy dog</p>');
  });
});
