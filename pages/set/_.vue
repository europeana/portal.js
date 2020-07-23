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
          {{ title }}
        </h1>
        <!-- TODO: Fill with the set's description  -->
        <h5 class="usergallery-description mb-4">
          Placeholder for description
        </h5>
        <div class="usergallery-metadata mb-4">
          <!-- TODO: Fill after the '@' with the set's owner  -->
          <span class="curator mr-4">
            {{ $t('userset.curatedBy') }} @placeholderUsername
          </span>
          <!-- TODO: Condition the existence of this element based on the value of the set's visibility  -->
          <span
            v-if="true"
            class="visibility"
          >
            {{ $t('userset.privateCollection') }}
          </span>
        </div>
        <!-- TODO: Add support for editing functionality  -->
        <b-button variant="outline-primary text-decoration-none">
          <span class="edit-button">
            {{ $t('userset.edit') }}
          </span>
        </b-button>
      </b-container>
    </div>
    <b-container class="pt-5">
      <span class="total-items">
        {{ itemsCount(total) }}
      </span>
      <b-row class="flex-md-row mt-3 pb-5">
        <b-col cols="12">
          <b-card-group
            class="masonry"
            deck
            data-qa="gallery images"
          >
            <client-only>
              <ContentCard
                v-for="image in images"
                :key="image.identifier"
                :title="image.title[0] || image.dcDescription[0]"
                :image-url="image.edmPreview[0]"
                :texts="cardTexts(image)"
                :lazy="false"
              />
            </client-only>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <PaginationNav
            v-if="showPagination"
            v-model="page"
            :limit="perPage"
            :total-results="total"
            :per-page="perPage"
            :link-gen="paginationLink"
          />
        </b-col>
      </b-row>
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
            <client-only>
              <!-- TODO: Fill with items from the Recommendation Engine API -->
              <ContentCard
                v-for="image in recommendations"
                :key="image.identifier"
                :title="image.title[0] || image.dcDescription[0]"
                :image-url="image.edmPreview[0]"
                :texts="cardTexts(image)"
                :lazy="false"
              />
            </client-only>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import pluralize from 'pluralize';
  import axios from 'axios';
  import { pageFromQuery } from '../../plugins/utils';

  const PER_PAGE = 12;

  export default {
    name: 'UserSet',
    components: {
      ClientOnly,
      ContentCard: () => import('../../components/generic/ContentCard'),
      PaginationNav: () => import('../../components/generic/PaginationNav')
    },
    async asyncData({ params, query, redirect, app }) {
      const currentPage = pageFromQuery(query.page);
      if ((currentPage === null) || (currentPage <= 0)) {
        // Redirect non-positive integer values for `page` to `page=1`
        return redirect(app.context.route.path + '?page=1');
      }

      // TODO: When XX-49 is merged, move this call to set-plugin
      let url = 'http://set-api-acceptance.eanadev.org/set/';
      let par = '?wskey=apidemo&profile=standard&userToken=' + app.$auth.getToken('keycloak') + '&page=' + (currentPage - 1) + '&pageSize=' + PER_PAGE;
      let uSet = null;
      await axios
        .get(url + params.pathMatch + par)
        .then(response => (uSet = response.data))
        .catch(error => (console.error(error)));

      // TODO: Just for design-test purposes. When Sets API is ready, remove it.
      let rows = uSet.total;
      let imgs = null;
      await axios
        .get('https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=sea&rows=' + rows + '&start=1&wskey=api2demo')
        .then(response => (imgs = response.data.items))
        .catch(error => (console.error(error)));

      // TODO: When Sets API is complete, update the returned-data accordingly
      return {
        images: imgs,
        // images: uSet.items,
        title: uSet.title[app.i18n.locale] ? uSet.title[app.i18n.locale] :  uSet.title['en'],
        // description: uSet.description[app.i18n.locale] ? uSet.description[app.i18n.locale] :  uSet.description['en'],
        page: currentPage,
        total: uSet.total,
        userSet: uSet,
        recommendations: imgs.slice(0, 8)
      };
    },
    data() {
      return {
        perPage: PER_PAGE,
        page: null
      };
    },
    computed: {
      showPagination() {
        return this.total > this.perPage;
      }
    },
    methods: {
      itemsCount(num) {
        if (num === 1) {
          return num + ' ' + this.$t('record.record');
        } else {
          return num + ' ' + pluralize.plural(this.$t('record.record'));
        }
      },
      paginationLink(val) {
        return this.$route.path + '?page=' + val;
      },
      cardTexts(result, variant) {
        const texts = [result.edmDataProvider];
        if (result.dcCreator) texts.unshift(result.dcCreator);
        if (variant === 'list') {
          if (!result.selector && result.dcDescription) texts.unshift(result.dcDescription);
        }
        return texts;
      }
    },
    head() {
      return {
        title: this.title
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
        content: '\e925';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
    .visibility {
      &:before {
        @extend .icon-font;
        content: '\e926';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
  }
  .edit-button {
    font-weight: 600;
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
