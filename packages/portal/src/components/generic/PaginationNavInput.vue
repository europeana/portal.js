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
          v-b-tooltip.top="!buttonText && $t('actions.previousPage')"
          :destination="prevUrl"
          :aria-label="$t('actions.previous')"
          :disabled="prevDisabled"
          :aria-hidden="prevDisabled"
          class="page-link"
          data-qa="prev button link"
          @mouseleave.native="hideTooltips"
        >
          <span
            v-if="buttonIconClass"
            :class="[buttonIconClass, {
              'mr-1': buttonText
            }]"
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
          v-b-tooltip.top="!buttonText && $t('actions.nextPage')"
          :destination="nextUrl"
          :aria-label="$t('actions.next')"
          :disabled="nextDisabled"
          :aria-hidden="nextDisabled"
          class="page-link"
          @mouseleave.native="hideTooltips"
        >
          <template v-if="buttonText">
            {{ $t('actions.next') }}
          </template>
          <span
            v-if="buttonIconClass"
            :class="[buttonIconClass,{
              'ml-1': buttonText
            }]"
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
  import hideTooltips from '@/mixins/hideTooltips';
  import SmartLink from './SmartLink';

  export default {
    name: 'PaginationNavInput',

    components: {
      SmartLink
    },

    mixins: [hideTooltips],

    props: {
      /**
       * Number of items per page
       */
      perPage: {
        type: Number,
        default: 24
      },
      /**
       * Total number of results
       */
      totalResults: {
        type: Number,
        default: 0
      },
      /**
       * Maximum number of results to show
       */
      maxResults: {
        type: Number,
        default: null
      },
      /**
       * Icon to use for the previous/next buttons. Set to null to hide the icon
       * @values icon-arrow-down, icon-arrow-outline
       */
      buttonIconClass: {
        type: String,
        default: 'icon-arrow-down'
      },
      /**
       * If true, show text on the previous/next buttons
       */
      buttonText: {
        type: Boolean,
        default: true
      },
      /**
       * If true, add an input field for the page number
       */
      pageInput: {
        type: Boolean,
        default: true
      },
      /**
       * If true, show progress indicator
       */
      progress: {
        type: Boolean,
        default: false
      },
      /**
       * Array of url params to exclude on pagination
       */
      excludeParams: {
        type: Array,
        default: () => []
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
          // TODO: why doesn't this exclude the params specified in the prop?
          this.$router.push(this.linkGen(this.page, false));
        }
      },

      linkGen(page, exclude = true) {
        const query = { ...this.$route.query, page };

        if (exclude) {
          for (const excludeParam of this.excludeParams) {
            delete query[excludeParam];
          }
        }

        return {
          hash: this.$route.hash,
          path: this.$route.path,
          query
        };
      }
    }

  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/pagination';
</style>

<docs lang="md">
  Default:
  ```jsx
  <PaginationNavInput
    :perPage="24"
    :totalResults="100"
  />
  ```
  With outlined icon buttons and progress indicator and no button text, no input field:
  ```jsx
  <PaginationNavInput
    :perPage="24"
    :totalResults="100"
    :buttonIconClass="'icon-arrow-outline'"
    :buttonText="false"
    :pageInput="false"
    :progress="true"
  />
  ```
</docs>
