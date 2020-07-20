import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';
import SummaryInfo from './SummaryInfo.vue';

const i18n = new VueI18n({
  locale: 'en'
});

storiesOf('Item page', module)
  .add('Summary Info', () => ({
    i18n,
    components: { SummaryInfo },
    data() {
      return {
        descriptions: {
          code: 'en',
          values: ['Lorem Ipsum']
        },
        titles: [
          {
            code: 'en',
            value: 'Title in English'
          },
          {
            code: 'en',
            value: 'Subtitle also in English'
          }
        ]
      };
    },
    template: `
      <b-container>
        <b-row class="my-5">
          <b-col cols="12">
            <SummaryInfo
              :descriptions="descriptions"
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
