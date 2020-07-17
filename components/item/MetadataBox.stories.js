import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import MetadataBox from './MetadataBox';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      'record.goodToKnow': 'Good to konw',
      'record.allMetaData': 'All metadata',
      'fieldLabels': {
        'default': {
          'dcContributor': 'Contributors',
          'dcCoverage': 'Place-Time',
          'dcCreator': 'Creator',
          'dcDate': 'Date',
          'dcDescription': 'Description',
          'dcDuration': 'Duration',
          'dcFormat': 'Format',
          'dcIdentifier': 'Identifier',
          'dcLanguage': 'Language',
          'dcMedium': 'Medium',
          'dcPublisher': 'Publisher',
          'dcRelation': 'Relations',
          'dcRights': 'Rights',
          'dcSource': 'Source',
          'dcSubject': 'Subject',
          'dctermsCreated': 'Creation date',
          'dctermsExtent': 'Extent',
          'dctermsHasPart': 'Consists of',
          'dctermsHasVersion': 'Has version',
          'dctermsIsFormatOf': 'Is format of',
          'dctermsIsPartOf': 'Is part of',
          'dctermsIsReferencedBy': 'Is referenced by',
          'dctermsIsReplacedBy': 'Is replaced by',
          'dctermsIsRequiredBy': 'Is required by',
          'dctermsIssued': 'Issue date',
          'dctermsMedium': 'Medium',
          'dctermsProvenance': 'Provenance',
          'dctermsPublished': 'Publication date',
          'dctermsReferences': 'References',
          'dctermsSpatial': 'Places',
          'dctermsTemporal': 'Temporal',
          'dcTitle': 'Title',
          'dcType': 'Type of object',
          'edmCountry': 'Providing country',
          'edmCurrentLocation': 'Current location',
          'edmDataProvider': 'Providing institution',
          'edmHasMet': 'Has Met',
          'edmIncorporates': 'Incorporates',
          'edmIntermediateProvider': 'Intermediate provider',
          'edmIsDerivativeOf': 'Is derivative of',
          'edmIsRepresentationOf': 'Is representation of',
          'edmIsSimilarTo': 'Is similar to',
          'edmIsSuccessorOf': 'Is successor of',
          'edmProvider': 'Provider',
          'edmRealizes': 'Realises',
          'edmRights': 'Rights statement for the media in this item (unless otherwise specified)',
          'edmUgc': 'User generated content',
          'europeanaCollectionName': 'Collection name',
          'keywords': 'Keywords (provided by the community)',
          'timestampCreated': 'Timestamp created',
          'timestampUpdate': 'Timestamp updated',
          'wasPresentAt': 'Was present at'
        }
      }
    }
  }
});

const formattedMetadata = {
  coreMetadata: {
    edmDataProvider: {
      def: ['Provider']
    },
    dcContributor: {
      en: ['Contributor']
    },
    dcSubject: {
      de: ['Subjekt'],
      def: [{
        about: 'https://term.museum-digital.de/md-de/tag/132',
        prefLabel: { de: ['Fotografie'], en: ['Photography'] }
      }]
    },
    dcType: { en: ['Format'] }
  },
  allMetadata: {
    edmDataProvider: {
      def: ['Provider']
    },
    dcContributor: {
      en: ['Contributor']
    },
    dcSubject: {
      de: ['Subjekt'],
      def: [{
        about: 'https://term.museum-digital.de/md-de/tag/132',
        prefLabel: { de: ['Fotografie'], en: ['Photography'] }
      }]
    },
    dcType: { en: ['Format'] },
    edmProvider: { def: ['Provider'] },
    edmIntermediateProvider: { def: ['museum-digital'] },
    edmCountry: { def: ['Germany'] },
    edmRights: { def: ['https://creativecommons.org/publicdomain/mark/1.0/'] },
    dcRights: { de: ['AlliiertenMuseum'] },
    dctermsCreated: { de: ['1994'] },
    dctermsSpatial: { de: ['Straße des 17. Juni (Berlin)'] },
    edmUgc: 'false',
    dctermsProvenance: { de: ['AlliiertenMuseum, Berlin'] },
    dcIdentifier: { def: ['B 2018/05.06542 (inventory number)', 'http://mint-projects.image.ntua.gr/Museu/ProvidedCHO/museum-digital/48697 (technical number)'] },
    europeanaCollectionName: ['247_AlliedMuseum'],
    timestampCreated: '2020-07-15T22:01:31.356Z',
    timestampUpdate: '2020-07-15T22:01:31.356Z',
    dctermsExtent: { de: ['24 x 36 mm'] },
    dcFormat: {
      en: ['Photography']
    },
    keywords: {}
  },
  transcribingAnnotations: []
};

storiesOf('Item page/MetadataBox', module)
  .add('Metadata Box 12 columns', () => ({
    i18n,
    components: { MetadataBox },
    data() {
      return formattedMetadata;
    },
    template: `<b-container>
      <b-row class="my-5">
        <b-col
          cols="12"
          lg="12"
        >
          <metadata-box
            :all-metadata="allMetadata"
            :core-metadata="coreMetadata"
            :transcribing-annotations="transcribingAnnotations"
          />
        </b-col>
      </b-row>
    </b-container>`
  })).add('Metadata Box 9 columns', () => ({
    i18n,
    components: { MetadataBox },
    data() {
      return formattedMetadata;
    },
    template: `<b-container>
      <b-row class="my-5">
        <b-col
          cols="12"
          lg="9"
        >
          <metadata-box
            :all-metadata="allMetadata"
            :core-metadata="coreMetadata"
            :transcribing-annotations="transcribingAnnotations"
          />
        </b-col>
      </b-row>
    </b-container>`
  }));
