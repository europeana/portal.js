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
        <h1 class="mb-2">
          {{ displayField('title') }}
        </h1>
        <h5 class="usergallery-description mb-4">
          {{ displayField('description') }}
        </h5>
        <div class="usergallery-metadata mb-4">
          <!-- TODO: Fill after the '@' with the set's owner  -->
          <!-- <span class="curator mr-4">
            {{ $t('userset.curatedBy') }} @placeholderUsername
          </span> -->
          <span
            v-if="userSet.visibility === 'private'"
            class="visibility"
          >
            {{ $t('userset.privateCollection') }}
          </span>
        </div>
        <div class="collection-buttons">
          <!-- TODO: Add support for editing functionality. Only visible if the viewer is the owner  -->
          <b-button
            v-if="userIsOwner"
            variant="outline-primary text-decoration-none"
          >
            <span class="text">
              {{ $t('userset.edit') }}
            </span>
          </b-button>
          <!-- TODO: Add support for sharing functionality. Only visible for public usersets  -->
          <b-button
            v-if="userSet.visibility === 'private'"
            variant="outline-primary text-decoration-none"
          >
            <span class="text">
              {{ $t('actions.share') }}
            </span>
          </b-button>
        </div>
      </b-container>
    </div>
    <b-container class="pt-5 pb-4">
      <span class="total-items">
        {{ $tc('items.itemCount', total, { count: total }) }}
      </span>
      <BrowseSet
        :set-id="setId"
        :items="userSet.items"
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
        <b-row class="flex-md-row mt-3 pb-5">
          <b-col cols="12">
            <b-card-group
              class="masonry"
              deck
              data-qa="gallery images"
            >
            <!-- TODO: Fill with items from the Recommendation Engine API -->
            </b-card-group>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
  import { pageFromQuery } from '../../plugins/utils';

  const PER_PAGE = 24;

  export default {
    name: 'UserSet',
    components: {
      BrowseSet: () => import('../../components/account/BrowseSet')
    },
    async asyncData({ params, query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);
      if ((currentPage === null) || (currentPage <= 0)) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.context.route.path + '?page=1');
      }

      // Retrieve the set with a given id
      let uSet = await app.$sets.getSet(params.pathMatch, currentPage, PER_PAGE);

      // TODO: Retrieve the recommendations of this set

      return {
        setId: params.pathMatch,
        page: currentPage,
        userSet: uSet,
        total: uSet.total,
        recommendations: []
      };
    },
    data() {
      return {
        perPage: PER_PAGE,
        page: null
      };
    },
    computed: {
      userIsOwner() {
        if (this.$store.state.auth.user && this.userSet.creator) {
          return (this.$store.state.auth.user.sub === this.userSet.creator.split('user/')[1]);
        }
        return false;
      }
    },
    methods: {
      displayField(field) {
        if (!this.userSet[field]) {
          return '';
        } else if (this.userSet[field][this.$i18n.locale]) {
          return this.userSet[field][this.$i18n.locale];
        } else {
          return this.userSet[field]['en'];
        }
      }
    },
    head() {
      return {
        title: this.displayField('title')
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
