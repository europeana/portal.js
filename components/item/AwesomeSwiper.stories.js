import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import AwesomeSwiper from './AwesomeSwiper';
import DownloadButton from '../generic/DownloadButton.vue';
import RightsStatementButton from '../generic/RightsStatementButton.vue';
import SocialShareModal from '../sharing/SocialShareModal.vue';
import ShareButton from '../sharing/ShareButton.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      actions: {
        close: 'close',
        download: 'download',
        share: 'share',
        shareOn: 'Share on {social}'
      }
    }
  }
};

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {
      return 'https://www.example.org/';
    }
  }
});

const media = [
  {
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/',
    downloadUrl: 'https://proxy.europeana.eu/2020601/https___1914_1918_europeana_eu_contributions_10265?view=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
  },
  {
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' },
    rightsStatement: 'https://creativecommons.org/licenses/by-nd/4.0/',
    downloadUrl: 'https://proxy.europeana.eu/2020601/https___1914_1918_europeana_eu_contributions_10265?view=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
  },
  {
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/',
    downloadUrl: 'https://proxy.europeana.eu/2020601/https___1914_1918_europeana_eu_contributions_10265?view=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
  },
  {
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/',
    downloadUrl: 'https://proxy.europeana.eu/2020601/https___1914_1918_europeana_eu_contributions_10265?view=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
  },
  {
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/',
    downloadUrl: 'https://proxy.europeana.eu/2020601/https___1914_1918_europeana_eu_contributions_10265?view=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg&api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
  }
];

storiesOf('Item page/Awesome Swiper', module)
  .add('Centered with multiple slides visible', () => ({
    i18n,
    components: { AwesomeSwiper },
    data() {
      return {
        media,
        id: '/2020601/https___1914_1918_europeana_eu_contributions_10265'
      };
    },
    template: `
      <div class="mt-3">
        <AwesomeSwiper
          :europeana-identifier="id"
          :media="media"
        />
      </div>
    `
  }))
  .add('Swiper with info components', () => ({
    i18n,
    store,
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      SocialShareModal,
      ShareButton
    },
    data() {
      return {
        activeIndex: 0,
        media,
        mediaUrl: 'https://www.example.org/media',
        id: '/2020601/https___1914_1918_europeana_eu_contributions_10265',
        rightsStatementIsUrl: true,
        disabled: false,
        target: '_blank'
      };
    },
    computed: {
      rightsStatement() {
        return media[this.activeIndex].rightsStatement;
      },
      downloadUrl() {
        return media[this.activeIndex].downloadUrl;
      }
    },
    methods: {
      onSwipe (index) {
        this.activeIndex = index;
      }
    },
    template: `
      <div class="mt-3">
        <AwesomeSwiper
          :europeana-identifier="id"
          :media="media"
          @slideChanged="onSwipe"
        />
        <b-container class="d-flex justify-content-around mt-5">
          <RightsStatementButton
            v-if="rightsStatementIsUrl"
            :rights-statement="rightsStatement"
          />
          <DownloadButton
            :url="downloadUrl"
            :disabled="disabled"
            :target="target"
          />
          <ShareButton />
          <SocialShareModal :media-url="mediaUrl" />
        </b-container>
      </div>
    `
  }));
