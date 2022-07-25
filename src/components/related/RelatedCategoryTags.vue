<template>
  <b-row class="flex-md-row">
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
        >
          {{ tag.name }}
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
      badgeLink(tag) {
        if (this.selected.includes(tag)) {
          const tags = this.selected.filter(item => item !== tag);
          if (tags.length === 0) {
            return this.$path({ name: 'stories' });
          }
          return this.$path({ name: 'stories', query: { tags: tags.join(',') } });
        }
        return this.$path({ name: 'stories', query: { tags: this.selected.concat(tag).join(',') } });
      },
      isActive(tagId) {
        return this.selected.includes(tagId);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .icon-ic-tag {
    color: $mediumgrey;
    display: inline-block;
    font-size: 1.5rem;
    padding-top: 0.25rem;
  }

  .badge {
    margin: 0 0.25rem 0.5rem;
  }
</style>
