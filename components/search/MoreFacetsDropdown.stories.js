import { storiesOf } from '@storybook/vue';
import MoreFacetsDropdown from './MoreFacetsDropdown.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      facets: {
        button: {
          cancel: 'Cancel',
          reset: 'Reset',
          apply: 'Apply',
          morefilters: 'More filters'
        }
      }
    }
  }
};

storiesOf('Search/MoreFacetsDropdown', module)
  .add('More Filters', () => ({
    components: { MoreFacetsDropdown },
    i18n,
    data() {
      return { facets: [
        {
          'name': 'LANGUAGE',
          'fields': [
            {
              'label': 'en',
              'count': 9230749
            },
            {
              'label': 'de',
              'count': 6714554
            },
            {
              'label': 'no',
              'count': 4676848
            },
            {
              'label': 'nl',
              'count': 3991384
            },
            {
              'label': 'sv',
              'count': 3604902
            },
            {
              'label': 'fr',
              'count': 3325609
            }
          ]
        },
        {
          'name': 'PROVIDER',
          'fields': [
            {
              'label': 'OpenUp!',
              'count': 8117543
            },
            {
              'label': 'The European Library',
              'count': 8098206
            },
            {
              'label': 'LoCloud',
              'count': 3386113
            },
            {
              'label': 'Swedish Open Cultural Heritage | K-samsök',
              'count': 2762220
            },
            {
              'label': 'Federacja Bibliotek Cyfrowych',
              'count': 2002605
            }
          ]
        },
        {
          'name': 'DATA_PROVIDER',
          'fields': [
            {
              'label': 'Naturalis Biodiversity Center',
              'count': 4512439
            },
            {
              'label': 'The National Archives of Norway',
              'count': 2995795
            },
            {
              'label': 'Bibliothèque nationale de France',
              'count': 1596589
            },
            {
              'label': 'Österreichische Nationalbibliothek - Austrian National Library',
              'count': 1499818
            },
            {
              'label': 'The Trustees of the Natural History Museum, London',
              'count': 1451168
            },
            {
              'label': 'National Library of the Netherlands',
              'count': 1294871
            },
            {
              'label': 'National Library of France',
              'count': 1224986
            }
          ]
        }
      ] };
    },
    template: ` <b-container
      class="mt-3"
      >
        <MoreFacetsDropdown :more-facets="facets" />
      </b-container>`
  }));


