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
        view="explore"
        class="mb-0"
        data-qa="similar items"
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
  import similarItemsQuery from '@/plugins/europeana/record/similar-items';
  import { addContentTierFilter } from '@/plugins/europeana/search';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import keycloak from '@/mixins/keycloak';

  export default {
    name: 'ItemRecommendations',
    components: {
      ItemPreviewCardGroup
    },

    mixins: [keycloak],

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
        response.items = response.items
          // Remove any recommendations that are the same as the active item,
          // because the Recommendation API/Engine is broken.
          // TODO: remove if/when recommendations become useful.
          .filter((item) => item.id !== this.identifier)
          .slice(0, 8);
      } else {
        response = await this.$apis.record.search({
          query: similarItemsQuery(this.identifier, this.similarItemsFields),
          qf: addContentTierFilter(),
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
        }
        return langMapValueForLocale(value, this.$i18n.locale)
          .values
          .filter(item => typeof item === 'string');
      }
    }
  };
</script>
