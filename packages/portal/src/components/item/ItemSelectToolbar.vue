<template>
  <div
    v-if="$features.itemMultiSelect"
    class="item-select-toolbar d-inline-flex"
  >
    <span class="toolbar-info">{{ $tc('set.toolbar.info', selectionCount, { count: selectionCount }) }}</span>
    <template v-if="selectionCount >= 1">
      <b-button
        :id="`deselect-selected-button`"
        ref="deselectSelectedButton"
        variant="link"
        data-qa="deselect selected button"
        :aria-label="$t('set.toolbar.actions.deselectSelected')"
        @click="deselectSelected"
      >
        {{ $t('set.toolbar.actions.deselectSelected') }}
      </b-button>
      <b-button
        :id="`remove-selected-button`"
        ref="removeSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-remove-circle-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.removeSelected', selectionCount, { count: selectionCount } )"
        data-qa="remove selected button"
        :aria-label="$t('set.toolbar.actions.removeSelected')"
        @click="removeSelected"
        @mouseleave="hideTooltips"
      />
      <b-button
        :id="`add-selected-button`"
        ref="addSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-add-circle-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.addSelected', selectionCount, { count: selectionCount } )"
        data-qa="add selected button"
        :aria-label="$t('set.actions.addSelected')"
        @click="addSelected"
        @mouseleave="hideTooltips"
      />
      <b-button
        :id="`like-selected-button`"
        ref="deselectSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-heart-outlined"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.likeSelected', selectionCount, { count: selectionCount } )"
        data-qa="deselect selected button"
        :aria-label="$t('set.actions.likeSelected')"
        @click="likeSelected"
        @mouseleave="hideTooltips"
      />
    </template>
  </div>
</template>

<script>
  import hideTooltips from '@/mixins/hideTooltips';

  export default {
    name: 'ItemSelectToolbar',

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

  .item-select-toolbar {
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

    .toolbar-info {
      display: inline-block;
      line-height: 32px;
    }

    button {
      &.btn-link {
        color: $white;
        text-decoration: underline;
        padding: 0 2rem 0 0.5rem;
      }

      &.btn-dark-flat {
        height: 2rem;
        width: 2rem;
        font-size: 2rem;
        margin: 0 0.25rem;
        &:last-child {
          margin-right: 0;
        }
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
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectToolbar />
  ```
</docs>
