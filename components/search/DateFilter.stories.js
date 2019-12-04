import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import DateFilter from './DateFilter.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      dateFilter: {
        startDate: 'Start date',
        endDate: 'End date'
      },
      facets: {
        'proxy_dcterms_issued': {
          name: 'Date Issued'
        }
      }
    }
  }
};

storiesOf('Search', module)
  .add('Date Filter', () => ({
    i18n,
    components: { DateFilter },
    methods: {
      log(a, b) {
        action('Change event emitted')(a, b);
      }
    },
    data() {
      return {
        name: 'proxy_dcterms_issued',
        start: '2019-11-07',
        end: '2019-11-08'
      };
    },
    template: ` <b-container
      class="mt-3"
      >
        <DateFilter
          :name="name"
          :start="start"
          :end="end"
          @dateFilter="log"
        />
      </b-container>`
  }));
