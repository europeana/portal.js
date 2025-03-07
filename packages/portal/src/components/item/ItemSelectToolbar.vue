<template>
  <div
    v-if="$features.itemMultiSelect"
    role="dialog"
    aria-labelledby="toolbar-info"
    class="item-select-toolbar position-fixed d-inline-flex align-items-center"
  >
    <span
      id="toolbar-info"
      class="toolbar-info"
    >
      {{ $tc('set.toolbar.info', selectionCount, { count: selectionCount }) }}
    </span>
    <template v-if="selectionCount >= 1">
      <b-button
        id="deselect-selected-button"
        ref="deselectSelectedButton"
        variant="link"
        data-qa="deselect selected button"
        class="p-0 mr-3 ml-1"
        :aria-label="$t('set.toolbar.actions.deselectSelected')"
        @click="deselectSelected"
      >
        {{ $t('set.toolbar.actions.deselectSelected') }}
      </b-button>
      <b-button
        v-if="userCanEditSet"
        id="remove-selected-button"
        ref="removeSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-remove-circle-outlined ml-2"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.removeSelected', selectionCount, { count: selectionCount } )"
        data-qa="remove selected button"
        :aria-label="$t('set.toolbar.actions.removeSelected')"
        @click="removeSelected"
        @mouseleave="hideTooltips"
      />
      <b-button
        id="add-selected-button"
        ref="addSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-add-circle-outlined ml-2"
        variant="dark-flat"
        :title="$tc('set.toolbar.actions.addSelected', selectionCount, { count: selectionCount } )"
        data-qa="add selected button"
        :aria-label="$t('set.actions.addSelected')"
        @click="addSelected"
        @mouseleave="hideTooltips"
      />
      <b-button
        id="like-selected-button"
        ref="deselectSelectedButton"
        v-b-tooltip.top
        class="button-icon-only icon-heart-outlined ml-2"
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

    props: {
      userCanEditSet: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      selectionCount() {
        return this.selected.length;
      },
      selected() {
        return this.$store.state.set.selectedItems;
      }
    },

    methods: {
      deselectSelected() {
        this.$store.commit('set/setSelected', []);
      },
      addSelected() {
        // TODO: intialise and open set modal
      },
      removeSelected() {
        // TODO: remove all selected items via store
      },
      likeSelected() {
        // TODO: add all selected items to likes via store
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-toolbar {
    border-radius: $border-radius-small;
    padding: 0.75rem;
    background-color: $black;
    color: $white;
    border: 1px solid $white;
    bottom: 1rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: fit-content;
    z-index: 4; // overlap footer
    font-size: $font-size-small;

    button {
      &.btn-link {
        color: $white;
        text-decoration: underline;
        font-size: $font-size-small;
      }

      &.btn-dark-flat {
        font-size: $font-size-large;
      }

      &:hover {
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
