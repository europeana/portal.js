<template>
  <b-row
    v-if="!$fetchState.pending && !$fetchState.error"
    class="mb-3 justify-content-center"
  >
    <b-col
      cols="12"
      class="col-lg-10"
    >
      <h2
        class="related-heading text-uppercase mb-2"
      >
        {{ $t('related.items.title') }}
      </h2>
      <ItemPreviewCardGroup
        v-show="items.length > 0"
        :items="items"
        class="mb-0"
        data-qa="similar items"
        :on-aux-click-card="onClickItem"
        :on-click-card="onClickItem"
      />
      <b-link
        v-if="!$auth.loggedIn"
        data-qa="log in button"
        class="btn btn-outline-secondary"
        @click="keycloakLogin"
      >
        {{ $t('related.items.loginForMore') }}
      </b-link>
    </b-col>
  </b-row>
</template>

<script>
  import { addContentTierFilter } from '@/utils/europeana/search.js';
  import { langMapValueForLocale } from '@europeana/i18n';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import keycloakMixin from '@/mixins/keycloak';
  import elasticApmReporterMixin from '@/mixins/elasticApmReporter';
  import similarItemsMixin from '@/mixins/similarItems';

  const PORTAL_ALGORITHM = 'Portal similar items query';
  const RECOMMENDATION_ALGORITHM = 'Recommendation API';

  export default {
    name: 'ItemRecommendations',
    components: {
      ItemPreviewCardGroup
    },

    mixins: [
      elasticApmReporterMixin,
      keycloakMixin,
      similarItemsMixin
    ],

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
        items: [],
        similarItemsAlgorithm: null
      };
    },

    async fetch() {
      let response;

      if (this.$auth.loggedIn) {
        response = await this.$apis.recommendation.recommend('record', this.identifier);
        response.items = response.items
          // Remove any recommendations that are the same as the active item,
          // because the Recommendation API/Engine is broken.
          // TODO: remove if/when recommendations become useful.
          .filter((item) => item.id !== this.identifier)
          .slice(0, 8);
        this.similarItemsAlgorithm = RECOMMENDATION_ALGORITHM;
      } else {
        response = await this.$apis.record.search({
          query: this.similarItemsQuery(this.identifier, this.similarItemsFields),
          qf: addContentTierFilter(),
          rows: 4,
          profile: 'minimal',
          facet: ''
        });
        this.similarItemsAlgorithm = PORTAL_ALGORITHM;
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
        }
        return langMapValueForLocale(value, this.$i18n.locale)
          .values
          .filter(item => typeof item === 'string');
      },
      // NOTE: do not use computed properties here as they may change when the
      //       item is clicked
      onClickItem(clickedItemId) {
        const itemCount = this.items.length;
        const rank = this.items.findIndex(item => item.id === clickedItemId) + 1;

        this.logApmTransaction({
          name: 'Similar items - click item',
          labels: { 'logged_in_user': !!this.$auth.loggedIn,
                    'similar_items_algorithm': this.similarItemsAlgorithm,
                    'similar_items_clicked_item': clickedItemId,
                    'similar_items_count': itemCount,
                    'similar_items_current_item': this.identifier,
                    'similar_item_rank': rank }
        });
      }
    }
  };
</script>
