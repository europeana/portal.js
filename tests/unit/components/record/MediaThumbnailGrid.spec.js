import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import thumbnailUrl from  '../../../../plugins/europeana/thumbnail';
import MediaThumbnailGrid from '../../../../components/record/MediaThumbnailGrid.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => mount(MediaThumbnailGrid, { localVue, propsData });

const media = [
  { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg' },
  { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2.jpg' },
  { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787078144_2.jpg' }
];
const selected = 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg';
const nonSelected = 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2.jpg';

describe('components/record/MediaThumbnailGrid', () => {
  it('shows a thumbnail for each media item', () => {
    const wrapper = factory({ media, selected });

    for (const item of media) {
      const src = thumbnailUrl(item.about, { size: 'w200' });
      wrapper.find(`img[data-about="${item.about}"][src="${src}"]`).isVisible().should.be.true;
    }
  });

  it('permits specification of size', () => {
    const wrapper = factory({ media, selected, size: 'w400' });

    for (const item of media) {
      const src = thumbnailUrl(item.about, { size: 'w400' });
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
