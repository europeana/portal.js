<template>
  <b-row
    v-if="!$fetchState.pending && !$fetchState.error && items.length > 0"
    class="mt-3 mb-0 justify-content-center"
  >
    <b-col
      cols="12"
      class="col-lg-10"
    >
      <h2
        class="related-heading text-uppercase mb-2"
      >
        {{ $t('record.exploreMore') }}
      </h2>
      <ItemPreviewCardGroup
        :items="items"
        view="explore"
        class="mb-0"
        data-qa="similar items"
      />
    </b-col>
  </b-row>
</template>

<script>
  import similarItemsQuery from '@/plugins/europeana/record/similar-items';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';

  export default {
    name: 'ItemRecommendedItems',

    components: {
      ItemPreviewCardGroup
    },

    props: {
      identifier: {
        type: String,
        required: true
      },

      dcType: {
        type: [String, Object, Array],
        default: null
      },

      dcSubject: {
        type: [String, Object, Array],
        default: null
      },

      dcCreator: {
        type: [String, Object, Array],
        default: null
      },

      edmDataProvider: {
        type: [String, Object, Array],
        default: null
      }
    },

    data() {
      return {
        items: []
      };
    },

    async fetch() {
      let response;

      if (this.$auth.loggedIn) {
        response = await this.$apis.recommendation.recommend('record', this.identifier);
      } else {
        response = await this.$apis.record.search({
          query: similarItemsQuery(this.identifier, this.similarItemsFields),
          rows: 4,
          profile: 'minimal',
          facet: ''
        });
      }

      this.items = response.items;
    },

    computed: {
      similarItemsFields() {
        return {
          dcSubject: this.similarItemsFieldValue(this.dcSubject),
          dcType: this.similarItemsFieldValue(this.dcType),
          dcCreator: this.similarItemsFieldValue(this.dcCreator),
          edmDataProvider: this.similarItemsFieldValue(this.edmDataProvider)
        };
      }
    },

    methods: {
      similarItemsFieldValue(value) {
        if (!value) {
          return null;
        } else {
          return langMapValueForLocale(value, this.$i18n.locale)
            .values
            .filter(item => typeof item === 'string');
        }
      }
    }
  };
</script>
