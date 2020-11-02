import { storiesOf } from '@storybook/vue';
import AudioPlayer from './AudioPlayer.vue';

storiesOf('Media/Audio Player', module)
  .add('OGG Format', () => ({
    components: {
      AudioPlayer
    },
    data() {
      return {
        id: '',
        src: '/audio/europeana-radio-welcome.ogg',
        type: 'audio/ogg'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
          :europeanaIdentifier="id"
          :src="src"
          :type="type"
        />
      </b-container>
    `
  }))
  .add('FLAC Format', () => ({
    components: {
      AudioPlayer
    },
    data() {
      return {
        id: '',
        src: '/audio/europeana-radio-welcome.flac',
        type: 'audio/flac'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
          :europeanaIdentifier="id"
          :src="src"
          :type="type"
        />
      </b-container>
    `
  }))
  .add('MP3 Format', () => ({
    components: {
      AudioPlayer
    },
    data() {
      return {
        id: '',
        src: '/audio/europeana-radio-welcome.mp3',
        type: 'audio/mpeg'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
          :europeanaIdentifier="id"
          :src="src"
          :type="type"
        />
      </b-container>
    `
  }));
