import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import SummaryInfo from '../../../src/components/item/SummaryInfo.vue';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      formatting: {
        ellipsis: '…'
      },
      readMore: 'Read more',
      showLess: 'Show less'
    }
  }
});

storiesOf('Item page/Summary Info', module)
  .add('All fields and long text', () => ({
    i18n,
    components: { SummaryInfo },
    data() {
      return {
        description: {
          code: 'en',
          values: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            'A second description, also in english, but this time it is auxiliary and comes after the first one.',
            'For some reason a third description.'
          ]
        },
        titles: [
          {
            code: 'en',
            value: 'Title in English'
          },
          {
            code: 'en',
            value: 'Subtitle also in English'
          },
          {
            code: 'en',
            value: 'And another super long subtitle for some reason. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. It\'s actually the description again, but it has this extra sentence and ends in an ellipsis... (there\'s actually no maximum length so this area could go on and on and on.)'
          }
        ]
      };
    },
    template: `
      <b-container>
        <b-row class="my-5">
          <b-col cols="12">
            <SummaryInfo
              :description="description"
              :titles="titles"
            />
          </b-col>
        </b-row>

      </b-container>
      <script>
        import SummaryInfo from './SummaryInfo';
        export default {
          components: {SummaryInfo}
        };
      </script>`
  }))
  .add('Only description', () => ({
    i18n,
    components: { SummaryInfo },
    data() {
      return {
        description: {
          code: 'en',
          values: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.']
        }
      };
    },
    template: `
      <b-container>
        <b-row class="my-5">
          <b-col cols="12">
            <SummaryInfo
              :description="description"
            />
          </b-col>
        </b-row>

      </b-container>
      <script>
        import SummaryInfo from './SummaryInfo';
        export default {
          components: {SummaryInfo}
        };
      </script>`
  }))
  .add('Only short description', () => ({
    i18n,
    components: { SummaryInfo },
    data() {
      return {
        description: {
          code: 'en',
          values: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit!!!']
        }
      };
    },
    template: `
      <b-container>
        <b-row class="my-5">
          <b-col cols="12">
            <SummaryInfo
              :description="description"
            />
          </b-col>
        </b-row>

      </b-container>
      <script>
        import SummaryInfo from './SummaryInfo';
        export default {
          components: {SummaryInfo}
        };
      </script>`
  }))
  .add('Only title', () => ({
    i18n,
    components: { SummaryInfo },
    data() {
      return {
        titles: [
          {
            code: 'en',
            value: 'Title in English'
          }
        ]
      };
    },
    template: `
      <b-container>
        <b-row class="my-5">
          <b-col cols="12">
            <SummaryInfo
              :titles="titles"
            />
          </b-col>
        </b-row>

      </b-container>
      <script>
        import SummaryInfo from './SummaryInfo';
        export default {
          components: {SummaryInfo}
        };
      </script>`
  }));
