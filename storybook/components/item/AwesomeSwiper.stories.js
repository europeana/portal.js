import { storiesOf } from '@storybook/vue';
import AwesomeSwiper from '../../../src/components/item/AwesomeSwiper';

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

const media = [
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' },
    rightsStatement: 'https://creativecommons.org/licenses/by-nd/4.0/'
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' },
    rightsStatement: 'http://creativecommons.org/licenses/by-sa/3.0/'
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
  .add('oEmbed slides', () => ({
    i18n,
    components: { AwesomeSwiper },
    data() {
      return {
        media: [
          {
            about: 'https://vimeo.com/383505907',
            thumbnails: { large: 'https://api.europeana.eu/thumbnail/v2/url.json?uri=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F569448856_1280x960.jpeg&type=VIDEO&size=w400' },
            rightsStatement: 'http://creativecommons.org/publicdomain/mark/1.0/'
          },
          {
            about: 'https://soundcloud.com/europeana/blackcap-recorded-at-camberley-surrey',
            thumbnails: { large: 'https://api.europeana.eu/thumbnail/v2/url.json?uri=http%3A%2F%2Fsounds.bl.uk%2Fwaveforms%2FBritish-wildlife-recordings%2F022A-W1CDR0001539-1100A0.png&type=SOUND&size=w400' },
            rightsStatement: 'http://creativecommons.org/licenses/by/4.0/'
          }
        ],
        id: '/mock/item'
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
  }));
