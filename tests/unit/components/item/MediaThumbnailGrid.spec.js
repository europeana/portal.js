import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MediaThumbnailGrid from '../../../../components/item/MediaThumbnailGrid.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(MediaThumbnailGrid, { localVue, propsData });

const media = [
  {
    about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg',
    thumbnails: {
      small: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2/small.jpg',
      large: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2/large.jpg'
    }
  },
  {
    about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2.jpg',
    thumbnails: {
      small: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2/small.jpg',
      large: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2/large.jpg'
    }
  },
  {
    about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787078144_2.jpg',
    thumbnails: {
      small: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787078144_2/small.jpg',
      large: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787078144_2/large.jpg'
    }
  }
];
const selected = 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg';
const nonSelected = 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2.jpg';
const defaultThumbnailType = 'TEXT';

describe('components/item/MediaThumbnailGrid', () => {
  it('shows a thumbnail for each media item, small by default', () => {
    const wrapper = factory({ media, selected, defaultThumbnailType });

    for (const item of media) {
      const src = item.thumbnails.small;
      wrapper.find(`img[data-about="${item.about}"][src="${src}"]`).isVisible().should.be.true;
    }
  });

  it('permits specification of size', () => {
    const wrapper = factory({ media, selected, defaultThumbnailType, size: 'large' });

    for (const item of media) {
      const src = item.thumbnails.large;
      wrapper.find(`img[src="${src}"]`).isVisible().should.be.true;
    }
  });

  it('marks the selected media item', () => {
    const wrapper = factory({ media, selected });

    const selectedImg = wrapper.find(`img[data-about="${selected}"]`);

    selectedImg.classes().should.include('selected');
  });

  describe('clicking on a non-selected thumbnail', () => {
    it('makes it the selected one', () => {
      const wrapper = factory({ media, selected });

      const nonSelectedImg = wrapper.find(`img[data-about="${nonSelected}"]`);

      nonSelectedImg.classes().should.not.include('selected');
      nonSelectedImg.trigger('click');
      nonSelectedImg.classes().should.include('selected');
    });

    it('emits a `select` event with the item URI', () => {
      const wrapper = factory({ media, selected });

      const nonSelectedImg = wrapper.find(`img[data-about="${nonSelected}"]`);
      nonSelectedImg.trigger('click');

      wrapper.emitted('select').should.deep.eq([[nonSelected]]);
    });
  });
});
