import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import DownloadButton from './DownloadButton.vue';
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

storiesOf('Generic', module)
  .add('Download Button', () => ({
    i18n,
    components: { DownloadButton },
    data() {
      return {
        url: "ggpht.com",
        downloadUrl: "https://proxy.europeana.eu/90402/RP_P_2010_310_78?view=https%3A%2F%2Flh3.ggpht.com%2F2fUZ-S-q0_qtKWYyA4lcTjnP5ezTGP8QV2KG6QUuB844vf-Yupo2NxV-_h3vsR71IAc5Jz_ucngoJMNizDeWWhsvVqM%3Ds0&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi",
        useProxy: false,
        downloadDisabled: false
      };
    },
    template: `
      <b-container class="mt-3 p-5 bg-white">
        <DownloadButton
          :url="url"
          :download-url="downloadUrl"
          :download-disabled="downloadDisabled"
          :use-proxy="useProxy"
        />
      </b-container>
    `
  }))
  .add('Download Button Disabled', () => ({
    i18n,
    components: { DownloadButton },
    data() {
      return {
        url: "ggpht.com",
        downloadDisabled: true
      };
    },
    template: `
      <b-container class="mt-3 p-5 bg-white">
        <DownloadButton
          v-if="!downloadDisabled"
          :url="url"
          :download-url="downloadUrl"
          :download-disabled="downloadDisabled"
          :use-proxy="useProxy"
        />
        <p v-else class="d-flex p-3 w-100"><span class="icon-info d-inline-flex pr-1 blue" style="font-size:24px;color:#0a72cc"></span>Because of its license, this item is not available for download.</p>
      </b-container>`
  }));
