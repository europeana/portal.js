import { storiesOf } from '@storybook/vue';

import MediaThumbnailGrid from './MediaThumbnailGrid.vue';

storiesOf('Record / Media thumbnail grid', module)
  .add('Default size (w200)', () => ({
    components: { MediaThumbnailGrid },
    data() {
      return {
        media: [
          { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg' },
          { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1289919650555_2.jpg' },
          { about: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787078144_2.jpg' }
        ],
        selected: 'http://www.mimo-db.eu/media/GNM/IMAGE/MIR1097_1279787057222_2.jpg'
      };
    },
    template: ` <b-container
      class="mt-3"
      >
        <MediaThumbnailGrid
          :media="media"
          :selected="selected"
        />
      </b-container>`
  }));
