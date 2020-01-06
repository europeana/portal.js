import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import RadioGroupFilter from './RadioGroupFilter.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      facets: {
        api: {
          name: 'Search for',
          options: {
            fulltext: 'Full text',
            metadata: 'Metadata'
          }
        }
      }
    }
  }
};

storiesOf('Search', module)
  .add('Record API toggle', () => ({
    i18n,
    components: { RadioGroupFilter },
    methods: {
      log(value) {
        action('Change event emitted')(value);
      }
    },
    data() {
      return {
        selectedOption: 'fulltext'
      };
    },
    template: `<b-container
      class="mt-3"
      >
        <RadioGroupFilter
          facet-name="api"
          :options="['fulltext', 'metadata']"
          selected="fulltext"
          @change="log"
        />
      </b-container>`
  }));
