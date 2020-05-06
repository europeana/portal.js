import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import AudioPlayer from './AudioPlayer.vue';

const store = new Vuex.Store({
  getters: {
    'apis/config': () => ({
      record: {
        origin: 'https://api.europeana.eu'
      }
    })
  }
});

storiesOf('Media/Audio Player', module)
  .add('OGG Format', () => ({
    store,
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
    store,
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
    store,
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
