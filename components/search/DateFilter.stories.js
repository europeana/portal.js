import { storiesOf } from '@storybook/vue';
import DateFilter from './DateFilter.vue';

const i18n = {
  locale: 'en',
  messages: {
    en: {
      dateFilter: {
        startDate: 'Start date',
        endDate: 'End date'
      }
    }
  }
};

storiesOf('Search', module)
  .add('Date Filter', () => ({
    i18n,
    components: { DateFilter },
    data() {
      return {
        name: 'Foo',
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
        />
      </b-container>`
  }));


