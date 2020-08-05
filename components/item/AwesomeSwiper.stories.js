import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import AwesomeSwiper from './AwesomeSwiper';

const i18n = new VueI18n();

const media = [
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg' }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg' }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg' }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' }
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
  }));
// TODO: This story doesn't work as the IIIF player makes use of an iframed page.
// .add('IIIF slide', () => ({
//   i18n,
//   components: { AwesomeSwiper },
//   data() {
//     return {
//       media: [{
//         about: 'https://gallica.bnf.fr/iiif/ark:/12148/bpt6k94565r/f1/full/full/0/native.jpg',
//         dcFormat: {
//           def: ['application/pdf']
//         },
//         svcsHasService: ['https://gallica.bnf.fr/iiif/ark:/12148/bpt6k94565r/f1'],
//         dctermsIsReferencedBy: ['https://gallica.bnf.fr/iiif/ark:/12148/bpt6k94565r/manifest.json'],
//         ebucoreHasMimeType: 'image/jpeg',
//         ebucoreFileByteSize: 63341,
//         ebucoreWidth: 3456,
//         ebucoreHeight: 4677,
//         edmHasColorSpace: 'grayscale',
//         edmComponentColor: ['#FFFFFF'],
//         ebucoreOrientation: 'portrait',
//         thumbnails: {
//           small: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w200&type=IMAGE&uri=http%3A%2F%2Fgallica.bnf.fr%2Fark%3A%2F12148%2Fbpt6k94565r.thumbnail.jpg',
//           large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=http%3A%2F%2Fgallica.bnf.fr%2Fark%3A%2F12148%2Fbpt6k94565r.thumbnail.jpg'
//         },
//         services: [{
//           about: 'https://gallica.bnf.fr/iiif/ark:/12148/bpt6k94565r/f1',
//           dctermsConformsTo:['http://iiif.io/api/image'],
//           doapImplements: ['http://iiif.io/api/image/2/level2.json']
//         }]
//       }],
//       id: '/9200333/BibliographicResource_3000115223398'
//     };
//   },
//   template: `
//       <div class="mt-3">
//         <AwesomeSwiper
//           :europeana-identifier="id"
//           :media="media"
//         />
//       </div>
//     `
// }));

