import { storiesOf } from '@storybook/vue';

import VideoPlayer from './VideoPlayer.vue';

storiesOf('Media', module)
  .add('Video Player', () => ({
    components: {
      VideoPlayer
    },
    data() {
      return {
        url: 'http://rs.kystreise.no/filestore/5/0/1/9_325fd46a56fb430/5019_alt_1773_d79cc2c9d9c9b45.webm',
        type: 'video/webm'
      };
    },
    template: `
      <b-containerb class="mt-3">
        <VideoPlayer
          :src="url"
          :type="type"
        />
      </b-container>
    `
  }));
