import { storiesOf } from '@storybook/vue';
import AudioPlayer from './AudioPlayer.vue';

storiesOf('Media/Audio Player', module)
  .add('OGG Format', () => ({
    components: {
      AudioPlayer
    },
    data() {
      return {
        src: 'https://proxy.europeana.eu/9200369/webclient_DeliveryManager_pid_8412047_custom_att_2_simple_viewer?api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi&view=http%3A%2F%2Fatena.beic.it%2Fwebclient%2FDeliveryManager%3Fpid%3D8412117%26custom_att_2%3Ddeeplink',
        type: 'audio/ogg'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
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
        src: 'https://hpr.dogphilosophy.net/test/flac.flac',
        type: 'audio/flac'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
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
        src: 'https://proxy.europeana.eu/2059203/data_sounds_http___www_statsbiblioteket_dk_nationalbibliotek_adgang_til_samlingerne_musik_og_lyd_rubensamlingen_lydoptagelser_resolveuid_12eb142eb7cd491199a60d5b89bd8773?api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi&view=http%3A%2F%2Fwww.statsbiblioteket.dk%2Fnationalbibliotek%2Fadgang-til-samlingerne%2Fmusik-og-lyd%2Frubensamlingen-lydoptagelser%2Fresolveuid%2F12eb142eb7cd491199a60d5b89bd8773',
        type: 'audio/mp3'
      };
    },
    template: `
      <b-container class="mt-3">
        <AudioPlayer
          :src="src"
          :type="type"
        />
      </b-container>
    `
  }));
