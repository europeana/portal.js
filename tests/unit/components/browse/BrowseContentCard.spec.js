import { createLocalVue, shallowMount } from '@vue/test-utils';
// TODO: is this needed?
import BootstrapVue from 'bootstrap-vue';
import BrowseContentCard from '../../../../components/browse/BrowseContentCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (props = { fields: {} }) => shallowMount(BrowseContentCard, {
  localVue,
  propsData: props
});

describe('components/browse/BrowseContentCard', () => {
  describe('imageUrl()', () => {
    context('when `fields.thumbnailUrl` is present', () => {
      it('is used', () => {
        const thumbnailUrl = 'https://www.example.org/image.jpg';
        const wrapper = factory({ fields: { thumbnailUrl: thumbnailUrl } });

        wrapper.vm.imageUrl.should.equal(thumbnailUrl);
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
            const wrapper = factory({ fields: { image: image } });

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
  });
});
