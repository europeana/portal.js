import { storiesOf } from '@storybook/vue';

import OEmbedMedia from './OEmbedMedia.vue';

storiesOf('Media/oEmbed', module)
  .add('Vimeo', () => ({
    components: {
      OEmbedMedia
    },
    data() {
      return {
        html: `<iframe src="https://player.vimeo.com/video/112866269" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
        <p><a href="https://vimeo.com/112866269">Sample video to embed</a> from <a href="https://vimeo.com/user31063077">Gillian Figueroa</a> on <a href="https://vimeo.com">Vimeo</a>.</p>`
      };
    },
    template: `
      <b-containerb class="mt-3">
        <OEmbedMedia :html="html" />
      </b-container>
    `
  }));

// .add('MP4 video', () => ({
//   components: {
//     VideoPlayer
//   },
//   data() {
//     return {
//       src: 'https://europeana1914-1918.s3.amazonaws.com/attachments/236696/9555.236696.original.mp4',
//       type: 'video/mp4'
//     };
//   },
//   template: `
//     <b-containerb class="mt-3">
//       <VideoPlayer
//         :src="src"
//         :type="type"
//       />
//     </b-container>
//   `
// }));
