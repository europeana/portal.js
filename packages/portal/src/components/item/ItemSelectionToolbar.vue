<template>
  <container
    v-if="$features.itemMultiSelect"
    class="multiSelectToolbar"
  >
    <span class="toolbar-info">{{ $tc('set.toolbar.info', selectionCount, { count: selectionCount }) }}</span>
    <template v-if="selectionCount >= 1">
      <b-button
        :id="`deselect-all-button`"
        ref="deselectAllButton"
        variant="link"
        data-qa="deselect all button"
        :aria-label="$t('set.toolbar.actions.deselectAll')"
        @click="deselectAll"
      >
        {{ $t('set.toolbar.actions.deselectAll') }}
      </b-button>
      <b-button
        :id="`remove-all-button`"
        ref="removeAllButton"
        v-b-tooltip.top
        class="button-icon-only icon-remove-circle-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.removeAll', selectionCount, { count: selectionCount } )"
        data-qa="remove all button"
        :aria-label="$t('set.toolbar.actions.removeAll')"
        @click="removeAll"
        @mouseleave="hideTooltips"
      />
      <b-button
        :id="`add-all-button`"
        ref="addAllButton"
        v-b-tooltip.top
        class="button-icon-only icon-add-circle-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.addAll', selectionCount, { count: selectionCount } )"
        data-qa="add all button"
        :aria-label="$t('set.actions.addAll')"
        @click="addAll"
        @mouseleave="hideTooltips"
      />
      <b-button
        :id="`like-all-button`"
        ref="deselectAllButton"
        v-b-tooltip.top
        class="button-icon-only icon-heart-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.likeAll', selectionCount, { count: selectionCount } )"
        data-qa="deselect all button"
        :aria-label="$t('set.actions.likeAll')"
        @click="likeAll"
        @mouseleave="hideTooltips"
      />
    </template>
  </container>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemSelectionToolbar',

    mixins: [hideTooltips],

    computed: {
      selectionCount() {
        return this.selected.length;
      },
      selected() {
        return this.$store.state.set.selectedItems;
      }
    },

    methods: {
      deselectAll() {
        // TODO: deselect all selected items via store
      },
      addAll() {
        // TODO: intialise and open set modal
      },
      removeAll() {
        // TODO: remove all selected items via store
      },
      likeAll() {
        // TODO: add all selected items to likes via store
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .multiSelectToolbar {
    border-radius: .25rem;
    padding: 1rem;
    position: fixed;
    // Abstract into shared style with .full-image-button from itemMediaPresentation?
    background-color: $black;
    color: $white;
    border: 1px solid $white;
    bottom: 1rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    z-index: 1;
  }

  .toolbar-info {
    display: inline-block;
  }

  button {
    &.btn-link {
      color: $white;
      text-decoration: none;
    }

    &:hover  {
      &.btn-dark-flat, &.btn-link {
        color: $white;
      }

      &.icon-heart-outlined::before {
        content: '\e918';
      }
      &.icon-add-circle-outlined::before {
        content: '\e907';
      }
      &.icon-remove-circle-outlined::before {
        content: '\e917';
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectionToolbar />
  ```
</docs>
