<template>
  <div
    data-qa="user gallery page"
    class="mt-n3"
  >
    <div
      class="bg-white py-5"
      fluid
    >
      <b-container>
        <h1
          class="mb-2"
          :lang="displayTitle.code"
        >
          {{ displayTitle.values[0] }}
        </h1>
        <p
          class="usergallery-description mb-4"
          :lang="displayDescription.code"
        >
          {{ displayDescription.values[0] }}
        </p>
        <div class="usergallery-metadata mb-4">
          <!-- TODO: Fill after the '@' with the set's owner  -->
          <!-- <span class="curator mr-4">
            {{ $t('userset.curatedBy') }} @placeholderUsername
          </span> -->
          <span
            v-if="visibility === 'private'"
            class="visibility"
          >
            {{ $t('userset.privateCollection') }}
          </span>
        </div>
        <!--
        <div class="collection-buttons">
          <b-button
            v-if="userIsOwner"
            variant="outline-primary text-decoration-none"
          >
            <span class="text">
              {{ $t('userset.edit') }}
            </span>
          </b-button>
          <b-button
            v-if="visibility === 'public'"
            variant="outline-primary text-decoration-none"
          >
            <span class="text">
              {{ $t('actions.share') }}
            </span>
          </b-button>
        </div> -->
      </b-container>
    </div>
    <b-container class="pt-5 pb-4">
      <span class="total-items">
        {{ $tc('items.itemCount', total, { count: total }) }}
      </span>
      <SetItems
        :items="items"
        :total="total"
        :page="page"
        :page-size="perPage"
      />
      <div
        v-if="recommendations.length > 0"
        class="recommendations"
      >
        <span class="recommended-items">
          {{ $t('userset.recommendedItems') }}
        </span>
      </div>
    </b-container>
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';

  export default {
    components: {
      SetItems: () => import('../../components/set/SetItems')
    },

    middleware: 'sanitisePageQuery',

    async fetch() {
      // TODO: error handling
      const set = await this.$sets.getSet(this.$route.params.pathMatch, {
        page: this.$route.query.page,
        pageSize: this.perPage
      });

      this.page = Number(this.$route.query.page);
      this.total = set.total;
      this.title = set.title;
      this.items = set.items;
      this.visibility = set.visibility;
      this.description = set.description;
    },

    data() {
      return {
        description: null,
        items: [],
        page: null,
        perPage: 24,
        recommendations: [],
        title: null,
        total: 0,
        visibility: null
      };
    },

    computed: {
      userIsOwner() {
        if (this.$store.state.auth.user && this.creator) {
          return (this.$store.state.auth.user.sub === this.creator.split('user/')[1]);
        }
        return false;
      },
      displayTitle() {
        return langMapValueForLocale(this.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.description, this.$i18n.locale);
      }
    },

    head() {
      return {
        title: this.displayTitle.values[0]
      };
    },

    watchQuery: ['page']
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .usergallery-description {
    color: $mediumgrey;
  }

  .usergallery-metadata {
    font-size: 0.9rem;
    font-weight: 600;
    height: 1.6rem;
    vertical-align: middle;
    .curator {
      &:before {
        @extend .icon-font;
        content: '\e92e';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
    .visibility {
      &:before {
        @extend .icon-font;
        content: '\e92d';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
  }
  .collection-buttons {
    button {
      &:first-child {
        margin-right: 1rem;
      }
    }
    .text {
      font-weight: 600;
    }
  }
  .total-items {
    color: $mediumgrey;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .recommended-items {
    color: $mediumgrey;
    font-size: 1.3rem;
    font-weight: 600;
  }
</style>
