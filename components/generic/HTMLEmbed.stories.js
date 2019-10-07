import { storiesOf } from '@storybook/vue';
import OEmbedMedia from './HTMLEmbed.vue';

storiesOf('Generic/HTMLEmbed', module)
  .add('OEmbed Media', () => ({
    components: {
      OEmbedMedia
    },
    data() {
      return {
        html: '<iframe src=\'https://player.vimeo.com/video/112866269\' width=\'640\' height=\'360\' frameborder=\'0\' allow=\'autoplay; fullscreen\' allowfullscreen></iframe>'
      };
    },
    template: `
      <b-container class='mt-3'>
        <OEmbedMedia :html='html' />
      </b-container>
    `
  }))
  .add('Youtube', () => ({
    components: {
      OEmbedMedia
    },
    data() {
      return {
        html: '<iframe width=\'560\' height=\'315\' src=\'https://www.youtube.com/embed/9YffrCViTVk\' frameborder=\'0\' allow=\'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\' allowfullscreen></iframe>'
      };
    },
    template: `
      <b-container class='mt-3'>
        <OEmbedMedia :html='html' />
      </b-container>
    `
  }));
