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
        name: 'Retrat d\'estudi',
        provider: 'Ajuntament de Girona',
        header: 'Welcome to Europeana',
        rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/',
        lead: 'Discover inspiring cultural heritage from European museums, galleries, libraries and archives',
        imageUrl: 'img/hero.jpg',
        url: 'http://data.europeana.eu/item/2024914/photography_ProvidedCHO_Ajuntament_de_Girona_090561',
        creator: 'Foto Lux'
      };
    },
    template: `
      <b-container class="mt-3">
        <HeroImage
          :image-url="imageUrl"
          :header="header"
          :lead="lead"
          :rights-statement="rightsStatement"
          :name="name"
          :provider="provider"
          :creator="creator"
          :url="url"
        />
      </b-container>
    `
  }));
