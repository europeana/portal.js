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
        :aria-hidden="prevDisabled"
        :class="{ 'disabled' : prevDisabled}"
        class="page-item btn-prev pl-0"
        data-qa="prev button"
      >
        <SmartLink
          :destination="prevUrl"
          :aria-label="$t('actions.previous')"
          :aria-disabled="prevDisabled"
          class="page-link"
        >
          <span class="icon-arrow-down" />
          {{ $t('actions.previous') }}
        </SmartLink>
      </li>
      <li
        class="page-item page-input"
      >
        <!-- TODO: use b-form-input instead? -->
        <input
          type="text"
          :value="page"
          @change="changePaginationNav"
        > {{ $t('of') }} {{ totalPages }}
      </li>
      <li
        :aria-hidden="nextDisabled"
        :class="{ 'disabled' : nextDisabled}"
        class="page-item btn-next pr-0"
        data-qa="next button"
      >
        <a
          :aria-label="$t('actions.next')"
          :aria-disabled="nextDisabled"
          href="#"
          class="page-link"
        >
          {{ $t('actions.next') }}
          <span class="icon-arrow-down" />
        </a>
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
      scrollToId: {
        type: String,
        default: 'header'
      },
      maxResults: {
        type: Number,
        default: null
      }
    },

    computed: {
      totalPages() {
        const atLeastOne = Math.max(this.totalResults, 1);
        return Math.ceil(Math.min(atLeastOne, this.maxResults || atLeastOne) / this.perPage);
      },

      prevDisabled() {
        console.log(this.linkGen(0));
        return this.page <= 1;
      },

      prevUrl() {
        return this.linkGen(this.page - 1);
      },

      nextDisabled() {
        return this.page === this.totalPages;
      },

      page() {
        return Number(this.$route?.query?.page) || 1;
      }
    },

    methods: {
      changePaginationNav() {
        // TODO: check if number added in input is a valid page number
        // TODO: update page + results
        this.scrollToElement();
      },

      scrollToElement() {
        this.$scrollTo(`#${this.scrollToId}`);
      },

      linkGen(page) {
        return {
          ...this.$route,
          query: { ...this.$route.query, page }
        };
      }
    }
  };
</script>
