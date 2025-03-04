<template>
  <div
    v-if="$features.itemMultiSelect"
    class="multiSelectToolbar"
  >
    <span>{{ $tc('set.toolbar.info', selectionCount, { count: selectionCount }) }}</span>
    <template v-if="selectionCount >= 1">
      <b-button
        :id="`deselect-all-button`"
        ref="deselectAllButton"
        data-qa="deselect all button"
        :aria-label="$t('set.actions.deselectAll')"
        @click="deselectAll"
      >
        {{ $t('set.actions.deselectAll') }}
      </b-button>
      <b-button
        :id="`remove-all-button`"
        ref="removeAllButton"
        v-b-tooltip.top
        :title="$tc('set.actions.removeAll', selectionCount, { count: selectionCount } )"
        data-qa="remove all button"
        :aria-label="$t('set.actions.removeAll')"
        @click="removeAll"
        @mouseleave="hideTooltips"
      >
        <span :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'" />
      </b-button>
      <b-button
        :id="`add-all-button`"
        ref="addAllButton"
        v-b-tooltip.top
        :title="$tc('set.actions.addAll', selectionCount, { count: selectionCount } )"
        data-qa="add all button"
        :aria-label="$t('set.actions.addAll')"
        @click="addAll"
        @mouseleave="hideTooltips"
      >
        <span :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'" />
      </b-button>
      <b-button
        :id="`like-all-button`"
        ref="deselectAllButton"
        v-b-tooltip.top
        :title="$tc('set.actions.likeAll', selectionCount, { count: selectionCount } )"
        data-qa="deselect all button"
        :aria-label="$t('set.actions.likeAll')"
        @click="likeAll"
        @mouseleave="hideTooltips"
      >
        <span :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'" />
      </b-button>
    </template>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemSelectionToolbar',

    mixins: [hideTooltips],

    props: {
      selected: {
        type: Array,
        default: []
      },
    },

    computed: {
      selectionCount() {
        return this.selected.length;
      }
    },

    methods: {
      deselectAll() {
        if (this.$auth.loggedIn) {
          this.selected = !this.selected;
          this.$emit('select', this.selected);
        } else {
          this.keycloakLogin();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .multiSelectToolbar {
    border-radius: .25rem;
    padding: 1rem;
    // Abstract into shared style with .full-image-button from itemMediaPresentation?
    background-color: $black;
    color: $white;
    border: 1px solid $white;
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    z-index: 1;
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectionToolbar />
  ```
</docs>
