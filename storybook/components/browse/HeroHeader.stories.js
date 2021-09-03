import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import HeroHeader from './HeroHeader.vue';

const i18n = new VueI18n();

storiesOf('Design', module)
  .add('Hero Header', () => ({
    i18n,
    components: { HeroHeader },
    data() {
      return {
        heroImage: {
          name: 'Retrat d\'estudi',
          provider: 'Ajuntament de Girona',
          license: 'http://creativecommons.org/publicdomain/mark/1.0/',
          image: {
            url: 'img/hero.jpg'
          },
          url: 'http://data.europeana.eu/item/2024914/photography_ProvidedCHO_Ajuntament_de_Girona_090561',
          creator: 'Foto Lux'
        },
        title: 'Welcome to Europeana!',
        description: 'Discover inspiring cultural heritage from European museums, galleries, libraries and archives',
        cta: {
          text: 'Check out our galleries!',
          url: 'https://europeana.eu/en/galleries'
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <HeroHeader
          :heroImage="heroImage"
          :title="title"
          :description="description"
          :cta="cta"
        />
      </b-container>
    `
  }));
