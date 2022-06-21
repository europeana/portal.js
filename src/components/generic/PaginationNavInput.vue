<template>
  <nav
    aria-hidden="false"
    aria-label="Pagination"
    data-qa="pagination navigation"
    class="pagination-nav-input"
  >
    <ul
      class="pl-0 d-flex justify-content-center"
    >
      <li
        :class="{ 'disabled' : prevDisabled}"
        class="page-item btn-prev pl-0"
        data-qa="prev button"
      >
        <SmartLink
          :destination="prevUrl"
          :aria-label="$t('actions.previous')"
          :disabled="prevDisabled"
          :aria-hidden="prevDisabled"
          class="page-link"
        >
          <span class="icon-arrow-down" />
          {{ $t('actions.previous') }}
        </SmartLink>
      </li>
      <li
        class="page-item page-input"
      >
        <b-form-input
          v-model="page"
          :aria-label="$t('pageNumber')"
          :lazy="true"
          :max="totalPages"
          :min="1"
          :number="true"
          data-qa="pagination input"
          type="number"
        /> {{ $t('of') }} {{ totalPages }}
      </li>
      <li
        :class="{ 'disabled' : nextDisabled}"
        class="page-item btn-next pr-0"
        data-qa="next button"
      >
        <SmartLink
          :destination="nextUrl"
          :aria-label="$t('actions.next')"
          :disabled="nextDisabled"
          :aria-hidden="nextDisabled"
          class="page-link"
        >
          {{ $t('actions.next') }}
          <span class="icon-arrow-down" />
        </SmartLink>
      </li>
    </ul>
  </nav>
</template>

<script>
  import SmartLink from './SmartLink';

  export default {
    name: 'PaginationNavInput',

    components: {
      SmartLink
    },

    props: {
      perPage: {
        type: Number,
        default: 24
      },
      totalResults: {
        type: Number,
        default: 0
      },
      maxResults: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        page: Number(this.$route?.query?.page) || 1
      };
    },

    computed: {
      totalPages() {
        const atLeastOne = Math.max(this.totalResults, 1);
        return Math.ceil(Math.min(atLeastOne, this.maxResults || atLeastOne) / this.perPage);
      },

      prevDisabled() {
        return this.page <= 1;
      },

      prevUrl() {
        return this.linkGen(this.page - 1);
      },

      nextUrl() {
        return this.linkGen(this.page + 1);
      },

      nextDisabled() {
        return this.page === this.totalPages;
      }
    },

    watch: {
      '$route.query.page'() {
        this.page = Number(this.$route?.query?.page) || 1;
      },
      page: 'changePaginationNav'
    },

    methods: {
      changePaginationNav() {
        const newRouteQuery = {  ...this.$route.query, page: this.page };
        const newRoute = { path: this.$route.path, query: newRouteQuery };
        this.$goto(newRoute);
      },

      linkGen(pageNo) {
        return {
          path: this.$route.path,
          query: { ...this.$route.query, page: pageNo }
        };
      }
    }

  };
</script>
