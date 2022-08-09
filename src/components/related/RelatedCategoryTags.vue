<template>
  <b-row class="flex-md-row related-category-tags responsive-font">
    <b-col
      v-if="tags.length > 0"
      data-qa="related category tags"
      cols="12"
      class="d-flex"
    >
      <span class="icon-ic-tag" />
      <div>
        <b-badge
          v-for="(tag, index) in tags"
          :key="index"
          variant="outline-light"
          :active="isActive(tag.identifier)"
          :to="badgeLink(tag.identifier)"
          @click.native="clickBadge(tag.identifier)"
        >
          <span>{{ tag.name }}</span>
          <span
            v-if="isActive(tag.identifier)"
            class="icon icon-clear clear-indicator"
          />
        </b-badge>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'RelatedCategoryTags',

    props: {
      tags: {
        type: Array,
        required: true
      },

      selected: {
        type: Array,
        default: () => []
      }
    },

    methods: {
      badgeLink(tagId) {
        const route = { name: 'stories' };

        if (this.selected.includes(tagId)) {
          const tags = this.selected.filter(item => item !== tagId);
          if (tags.length > 0) {
            route.query = { tags: tags.join(',') };
          }
        } else {
          route.query = { tags: this.selected.concat(tagId).join(',') };
        }

        return this.$path(route);
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
  @import '@/assets/scss/variables';

  .related-category-tags {
    margin-bottom: 0.5rem;
  }

  .icon-ic-tag {
    color: $mediumgrey;
    display: inline-block;
    font-size: 1.5rem;
    line-height: calc(2rem - 1px);

    @media (min-width: $bp-xxxl) {
      line-height: 2.25vw;
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

    .icon-clear {
      color: #000;
      font-size: 1.25rem;
      margin-left: 0.25rem;
    }
  }
</style>
