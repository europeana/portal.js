import { createLocalVue, shallowMount } from '@vue/test-utils';
// TODO: is this needed?
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';

import BrowseContentCard from '../../../../components/browse/BrowseContentCard.vue';
import apiConfig from '../../../../modules/apis/defaults';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    'apis/config': () => apiConfig
  }
});

const factory = (props = { fields: {} }) => shallowMount(BrowseContentCard, {
  localVue,
  store,
  propsData: props,
  mocks: {
    localePath: (opts) => opts
  }
});

describe('components/browse/BrowseContentCard', () => {
  describe('title()', () => {
    it('uses `fields.name`', () => {
      const name = 'Content item';
      const wrapper = factory({ fields: { name } });

      wrapper.vm.title.should.eq(name);
    });
  });

  describe('imageUrl()', () => {
    context('when `fields.thumbnailUrl` is present', () => {
      it('is used', () => {
        const thumbnailUrl = 'https://www.example.org/image.jpg';
        const wrapper = factory({ fields: { thumbnailUrl } });

        wrapper.vm.imageUrl.should.equal(thumbnailUrl);
      });
    });

    context('when `fields.image` is a string', () => {
      context('and is a wikimedia URL', () => {
        it('is converted to a scaled image URL', () => {
          const fullUrl = 'http://commons.wikimedia.org/wiki/Special:FilePath/image.jpg';
          const scaledUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/image.jpg/255px-image.jpg';

          const wrapper = factory({ fields: { image: fullUrl } });

          wrapper.vm.imageUrl.should.equal(scaledUrl);
        });
      });

      context('but is not a wikimedia URL', () => {
        it('is used', () => {
          const image = 'https://www.example.org/image.jpg';
          const wrapper = factory({ fields: { image } });

          wrapper.vm.imageUrl.should.equal(image);
        });
      });
    });

    context('when `fields.image` is an object with its own fields', () => {
      it('uses `fields.image.fields.file.url`', () => {
        const imageUrl = 'https://www.example.org/image.jpg';
        const wrapper = factory({ fields: { image: { fields: { file: { url: imageUrl } } } } });

        wrapper.vm.imageUrl.should.equal(imageUrl);
      });
    });

    context('otherwise', () => {
      it('is an empty string', () => {
        const wrapper = factory();

        wrapper.vm.imageUrl.should.equal('');
      });
    });
  });

  describe('destination()', () => {
    context('when `fields.url` is present', () => {
      it('is used', () => {
        const url = 'https://www.example.org/';
        const wrapper = factory({ fields: { url } });

        wrapper.vm.destination.should.equal(url);
      });
    });

    context('when `fields.identifier` is a Europeana record ID', () => {
      it('constructs a route to the record page', () => {
        const identifier = '/123456/abcdef_7890';
        const wrapper = factory({ fields: { identifier } });

        wrapper.vm.destination.should.eql({ name: 'record-all', params: { pathMatch: identifier.slice(1) } });
      });
    });

    context('when `fields.identifier` is a http(s) URL', () => {
      context('and is a Europeana entity URI', () => {
        it('constructs a route to the entity page', () => {
          const entityType = 'agent';
          const entityHumanType = 'person';
          const entityId = '12345';
          const identifier = `http://data.europeana.eu/${entityType}/base/${entityId}`;
          const wrapper = factory({ fields: { identifier } });

          wrapper.vm.destination.should.eql({ name: 'collections-type-all', params: { type: entityHumanType, pathMatch: entityId } });
        });
      });

      context('but is not a Europeana entity URI', () => {
        it('is used', () => {
          const identifier = 'https://www.example.org/';
          const wrapper = factory({ fields: { identifier } });

          wrapper.vm.destination.should.eql(identifier);
        });
      });
    });

    context('otherwise', () => {
      it('is an empty string', () => {
        const wrapper = factory();

        wrapper.vm.destination.should.equal('');
      });
    });
  });

  describe('texts()', () => {
    it('is includes description, creator and provider fields', () => {
      const description = 'Some interesting content';
      const creator = 'A European artist';
      const provider = 'An aggregator';
      const wrapper = factory({ fields: { description, creator, provider } });

      wrapper.vm.texts.should.include(description);
      wrapper.vm.texts.should.include(creator);
      wrapper.vm.texts.should.include(provider);
    });
  });
});
