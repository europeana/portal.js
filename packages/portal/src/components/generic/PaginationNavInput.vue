<template>
  <nav
    v-show="showPagination"
    aria-hidden="false"
    :aria-label="$t('pagination.label')"
    data-qa="pagination navigation"
    class="pagination-nav-input"
  >
    <ul
      class="pl-0 d-flex justify-content-center"
    >
      <li
        :class="{ 'disabled' : prevDisabled }"
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
          <span
            v-if="buttonIcons"
            class="icon-arrow-down"
            :class="{ 'mr-1': pageInput }"
          />
          <template v-if="buttonText">
            {{ $t('actions.previous') }}
          </template>
        </SmartLink>
      </li>
      <li
        v-if="pageInput"
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
        :class="{ 'disabled' : nextDisabled, 'pr-0': !progress }"
        class="page-item btn-next"
        data-qa="next button"
      >
        <SmartLink
          :destination="nextUrl"
          :aria-label="$t('actions.next')"
          :disabled="nextDisabled"
          :aria-hidden="nextDisabled"
          class="page-link"
        >
          <template v-if="buttonText">
            {{ $t('actions.next') }}
          </template>
          <span
            v-if="buttonIcons"
            class="icon-arrow-down"
            :class="{ 'ml-1': pageInput }"
          />
        </SmartLink>
      </li>
      <li
        v-if="progress"
        class="page-item pr-0"
      >
        {{ page }}/{{ totalPages }}
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
      },
      buttonIcons: {
        type: Boolean,
        default: true
      },
      buttonText: {
        type: Boolean,
        default: true
      },
      pageInput: {
        type: Boolean,
        default: true
      },
      progress: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        page: Number(this.$route?.query?.page) || 1
      };
    },

    computed: {
      showPagination() {
        return this.totalResults > this.perPage;
      },

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
        return this.page >= this.totalPages;
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
        if (this.page) {
          this.$router.push(this.linkGen(this.page));
        }
      },

      linkGen(pageNo) {
        return {
          path: this.$route.path,
          query: { ...this.$route.query, page: pageNo },
          hash: this.$route.hash
        };
      }
    }

  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/pagination';
</style>
