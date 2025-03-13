<template>
  <div
    v-if="$features.itemMultiSelect"
    role="dialog"
    aria-labelledby="toolbar-info"
    class="item-select-toolbar position-fixed d-inline-flex flex-wrap align-items-center justify-content-center"
  >
    <span class="d-inline-flex flex-wrap align-items-center justify-content-center">
      <span
        id="toolbar-info"
        class="toolbar-info my-1"
      >
        {{ $tc('set.toolbar.info', selectionCount, { count: selectionCount }) }}
      </span>
      <template v-if="selectionCount >= 1">
        <b-button
          id="deselect-selected-button"
          ref="deselectSelectedButton"
          variant="link"
          data-qa="deselect selected button"
          class="p-0 mr-3 ml-1 my-1"
          :aria-label="$t('set.toolbar.actions.deselectSelected')"
          @click="deselectSelected"
        >
          {{ $t('set.toolbar.actions.deselectSelected') }}
        </b-button>
      </template>
    </span>
    <div class="my-1 d-flex">
      <ItemRemoveButton
        v-if="userCanEditSet"
        :identifiers="selected"
        button-variant="dark-flat"
        class="ml-2"
      />
      <ItemAddButton
        :identifiers="selected"
        button-variant="dark-flat"
        class="ml-2"
      />
      <ItemLikeButton
        :identifiers="selected"
        button-variant="dark-flat"
        class="ml-2"
      />
    </div>
  </div>
</template>

<script>
  import ItemAddButton from '@/components/item/ItemAddButton';
  import ItemLikeButton from '@/components/item/ItemLikeButton';
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemSelectToolbar',

    components: {
      ItemAddButton,
      ItemLikeButton,
      ItemRemoveButton: () => import('@/components/item/ItemRemoveButton.vue')
    },

    props: {
      userCanEditSet: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const { hideTooltips } = useHideTooltips();
      return { hideTooltips };
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
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-toolbar {
    border-radius: $border-radius-small;
    padding: 0.5626rem 0.75rem;
    background-color: $black;
    color: $white;
    border: 1px solid $white;
    bottom: 1rem;
    left: 0;
    right: 0;
    margin: 0 1rem;
    z-index: 1060; // overlap footer, feedback button
    font-size: $font-size-small;

    @media (min-width: $bp-small) {
      width: fit-content;
      left: 5rem; // reserve space for feedback button
      right: 5rem;
      margin: 0 auto;
    }

    .toolbar-info {
      line-height: 1.5rem;
    }

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

  .modal-open .item-select-toolbar {
    z-index: 1030; // do not overlap modals
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectToolbar />
  ```
</docs>
