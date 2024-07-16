<template>
  <b-row class="flex-md-row related-category-tags">
    <b-col
      v-if="tags.length > 0"
      data-qa="related category tags"
      cols="12"
    >
      <h2
        v-if="heading"
        class="related-heading text-uppercase"
      >
        {{ $t('related.categoryTags.title') }}
      </h2>
      <div
        class="d-flex"
      >
        <span class="icon-ic-tag" />
        <div>
          <b-badge
            v-for="(tag, index) in tags.filter((tag) => !!tag)"
            :key="index"
            variant="outline-light"
            :active="isActive(tag.identifier)"
            :to="badgeLink(tag.identifier)"
            :data-qa="`${tag.name} category tag`"
            @click.native="clickBadge(tag.identifier)"
          >
            <span>{{ tag.name }}</span>
            <span
              v-if="isActive(tag.identifier)"
              class="icon icon-clear clear-indicator"
            />
          </b-badge>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'RelatedCategoryTags',

    props: {
      /**
       * Array of tags
       */
      tags: {
        type: Array,
        required: true
      },
      /**
       * Array of tags selected by the user
       */
      selected: {
        type: Array,
        default: () => []
      },
      /**
       * Toggle to show or hide the heading
       */
      heading: {
        type: Boolean,
        default: true
      }
    },

    methods: {
      badgeLink(tagId) {
        const route = { name: 'stories' };

        if (this.selected.includes(tagId)) {
          const tagsWithoutCurrent = this.selected.filter(item => item !== tagId);
          const tagsQuery = tagsWithoutCurrent.length > 0 ? tagsWithoutCurrent.join(',') : undefined;
          route.query = { ...this.$route.query, page: undefined, tags: tagsQuery };
        } else {
          route.query = {  ...this.$route.query, page: undefined, tags: this.selected.concat(tagId).join(',') };
        }

        return this.localePath(route);
      },
      isActive(tagId) {
        return this.selected.includes(tagId);
      },
      clickBadge(tagId) {
        if (this.$matomo) {
          const action = this.isActive(tagId) ? 'Deselect tag' : 'Select tag';
          this.$matomo.trackEvent('Tags', action, tagId);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .icon-ic-tag {
    color: $mediumgrey;
    display: inline-block;
    font-size: 1.5rem;
    line-height: calc(2rem - 1px);

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        line-height: calc(1.5 * calc(2rem - 1px));
        font-size: calc(1.5 * 1.5rem);
      }
    }
  }

  .badge-outline-light {
    margin: 0 0.25rem 0.5rem;

    @media (min-width: $bp-medium) {
      overflow: visible;
      max-width: none;

      span {
        overflow: visible;
      }
    }

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        margin: 0 calc(1.5 * 0.25rem) calc(1.5 * 0.25rem);
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <RelatedCategoryTags
    :tags="[
      {
      identifier: 'Women\'s history',
      name: 'Women\'s history'
      },
      {
      identifier: 'Renaissance',
      name: 'Renaissance'
      }]"
  />
  ```
  Tags without heading and including some selected
  ```jsx
  <RelatedCategoryTags
    :tags="[
      {
      identifier: 'Women\'s history',
      name: 'Women\'s history'
      },
      {
      identifier: 'Renaissance',
      name: 'Renaissance'
      }]"
    :selected="['Women\'s history']"
    :heading="false"
  />
  ```
</docs>
