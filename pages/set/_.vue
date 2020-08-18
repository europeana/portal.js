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
            <div class="collection-buttons">
              <b-button
                v-if="userIsOwner"
                v-b-modal.set-form-modal
                variant="outline-primary text-decoration-none"
              >
                <span class="text">
                  {{ $t('set.edit') }}
                </span>
              </b-button>
              <!-- <b-button
                v-if="visibility === 'public'"
                variant="outline-primary text-decoration-none"
              >
                <span class="text">
                  {{ $t('actions.share') }}
                </span>
              </b-button> -->
            </div>
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
          <b-container class="px-0">
            <b-row class="mb-3">
              <b-col cols="12">
                <ItemPreviewCardGroup
                  v-model="items"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <client-only>
                  <!--
                    FIXME: Set API item pagination is not yet implemented when retrieving single
                           sets if those are "closed" sets, as these will always be.
                           When implemented, `:per-page` should then be ``"perPage"``
                  -->
                  <PaginationNav
                    v-model="page"
                    :total-results="total"
                    :per-page="total"
                  />
                </client-only>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row
        v-if="recommendations.length > 0"
        class="recommendations"
      >
        <b-col>
          <span class="recommended-items">
            {{ $t('items.youMightLike') }}
          </span>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      id="set-form-modal"
      :title="$t('collectionModal.editCollection')"
      hide-footer
    >
      <SetForm
        :id="id"
        :title="title"
        :description="description"
        :visibility="visibility"
        @close="$bvModal.hide('set-form-modal')"
        @update="updateSet"
      />
    </b-modal>
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';

  import ClientOnly from 'vue-client-only';
  import SetForm from '../../components/set/SetForm';
  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';

  export default {
    components: {
      ClientOnly,
      ItemPreviewCardGroup,
      SetForm,
      PaginationNav: () => import('../../components/generic/PaginationNav')
    },

    middleware: 'sanitisePageQuery',

    // TODO: error handling for Nuxt 2.12 fetch()
    //       https://nuxtjs.org/blog/understanding-how-fetch-works-in-nuxt-2-12/#error-handling
    async fetch() {
      this.page = this.$store.state.sanitised.page - 1; // Set API paging starts at 0 ¯\_(ツ)_/¯

      const set = await this.$sets.getSet(this.$route.params.pathMatch, {
        page: this.page,
        pageSize: this.perPage,
        profile: 'itemDescriptions'
      });

      this.id = set.id;
      this.title = set.title;
      this.description = set.description;
      this.visibility = set.visibility;
      this.creator = set.creator;
      this.total = set.total || 0;
      this.items = set.items;
    },

    data() {
      return {
        id: null,
        creator: null,
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
        return this.$store.state.auth.user &&
          this.creator &&
          this.creator.endsWith(`/${this.$store.state.auth.user.sub}`);
      },
      displayTitle() {
        return langMapValueForLocale(this.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.description, this.$i18n.locale);
      }
    },

    watch: {
      '$route.query.page': '$fetch'
    },

    methods: {
      updateSet(set) {
        // console.log('updated set', set);
        this.id = set.id;
        this.title = set.title;
        this.description = set.description;
        this.visibility = set.visibility;
        this.$bvModal.hide('set-form-modal');
      }
    },

    head() {
      return {
        title: this.displayTitle.values[0]
      };
    }
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
