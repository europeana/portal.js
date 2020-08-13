<template>
  <div
    data-qa="user gallery page"
    class="mt-n3"
  >
    <b-container
      fluid
    >
      <b-row class="flex-md-row pt-5 bg-white mb-4">
        <b-col
          cols="12"
        >
          <b-container class="mb-5">
            <b-row class="mb-3">
              <b-col>
                <h1
                  class="pt-3"
                  :lang="displayTitle.code"
                >
                  {{ displayTitle.values[0] }}
                </h1>
                <p
                  class="usergallery-description mb-3 w-75"
                  :lang="displayDescription.code"
                >
                  {{ displayDescription.values[0] }}
                </p>
                <!-- TODO: to avoid showing an empty div + whitespace, the v-if is on the div
                    This can be changed when this functionality is further developed
                -->
                <div
                  v-if="visibility === 'private'"
                  class="usergallery-metadata"
                >
                  <!-- TODO: Fill after the '@' with the set's owner  -->
                  <!-- <span class="curator mr-4">
                    {{ $t('set.curatedBy') }} @placeholderUsername
                  </span> -->
                  <span
                    class="visibility"
                  >
                    {{ $t('set.privateCollection') }}
                  </span>
                </div>
              </b-col>
            </b-row>
            <!--
            <div class="collection-buttons">
              <b-button
                v-if="userIsOwner"
                variant="outline-primary text-decoration-none"
              >
                <span class="text">
                  {{ $t('set.edit') }}
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
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mb-3">
      <b-row>
        <b-col>
          <h2 class="related-heading text-uppercase">
            {{ $tc('items.itemCount', total, { count: total }) }}
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <SetItems
            :items="items"
            :total="total"
            :page="page"
            :page-size="perPage"
          />
        </b-col>
      </b-row>
      <b-row
        v-if="recommendations.length > 0"
        class="recommendations"
      >
        <b-col>
          <span class="recommended-items">
            {{ $t('set.recommendedItems') }}
          </span>
        </b-col>
      </b-row>
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

    // TODO: error handling for Nuxt 2.12 fetch()
    //       https://nuxtjs.org/blog/understanding-how-fetch-works-in-nuxt-2-12/#error-handling
    async fetch() {
      this.page = this.$store.state.sanitised.page;

      const set = await this.$sets.getSet(this.$route.params.pathMatch, {
        page: this.page,
        pageSize: this.perPage
      });
      
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

  .recommended-items {
    color: $mediumgrey;
    font-size: 1.3rem;
    font-weight: 600;
  }
</style>
