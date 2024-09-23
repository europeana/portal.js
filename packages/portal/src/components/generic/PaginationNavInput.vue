<template>
  <nav
    v-show="showPagination"
    aria-hidden="false"
    :aria-label="$t('pagination.label')"
    data-qa="pagination navigation"
    class="pagination-nav-input"
  >
    <ul
      class="pl-0 d-flex justify-content-center align-items-center"
    >
      <li
        :class="{
          'disabled' : prevDisabled,
          'btn-text': buttonText,
          'mr-md-3': pageInput
        }"
        class="page-item btn-prev d-flex pl-0 mr-2"
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
            :class="{
              'icon-arrow-down mr-1': buttonText,
              'icon-arrow-outline': !buttonText
            }"
            data-qa="prev button icon"
          />
          <template v-if="buttonText">
            {{ $t('actions.previous') }}
          </template>
        </SmartLink>
      </li>
      <li
        v-if="pageInput"
        class="page-item page-input d-flex "
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
        :class="{
          'btn-text': buttonText,
          'disabled' : nextDisabled,
          'ml-2 ml-md-3': pageInput,
          'mr-2': progress
        }"
        class="page-item btn-next d-flex pr-0"
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
            :class="{
              'icon-arrow-down ml-1': buttonText,
              'icon-arrow-outline': !buttonText
            }"
            data-qa="next button icon"
          />
        </SmartLink>
      </li>
      <li
        v-if="progress"
        class="pagination-progress d-flex align-items-center"
        data-qa="pagination progress"
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
