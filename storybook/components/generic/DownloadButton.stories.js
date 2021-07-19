import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import DownloadButton from '../../../src/components/generic/DownloadButton.vue';
import InfoMessage from '../../../src/components/generic/InfoMessage.vue';
import '../../assets/scss/icons.scss';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      actions: {
        download: 'Download'
      }
    }
  }
});

storiesOf('Generic/Download Button', module)
  .add('Enabled', () => ({
    i18n,
    components: { DownloadButton },
    data() {
      return {
        url: 'https://proxy.europeana.eu/90402/RP_P_2010_310_78?view=https%3A%2F%2Flh3.ggpht.com%2F2fUZ-S-q0_qtKWYyA4lcTjnP5ezTGP8QV2KG6QUuB844vf-Yupo2NxV-_h3vsR71IAc5Jz_ucngoJMNizDeWWhsvVqM%3Ds0&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi',
        disabled: false,
        target: '_blank'
      };
    },
    template: `
      <b-container class="mt-3 p-3 bg-white">
        <DownloadButton
          :url="url"
          :disabled="disabled"
          :target="target"
        />
      </b-container>
    `
  }))
  .add('Disabled', () => ({
    i18n,
    components: {
      DownloadButton,
      InfoMessage
    },
    data() {
      return {
        url: 'ggpht.com',
        disabled: true
      };
    },
    template: `
      <b-container class="mt-3">
        <DownloadButton
          v-if="!disabled"
          :url="url"
          :disabled="disabled"
          :target="target"
        />
        <InfoMessage v-else
          message="Because of its license, this item is not available for download."
          variant="icon"
        />
      </b-container>`
  }));
