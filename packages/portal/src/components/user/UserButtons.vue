<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <ItemPinButton
      v-if="showPins"
      data-qa="item pin button"
      :identifier="identifier"
      :entities="entities"
      :button-variant="buttonVariant"
      :button-text="buttonText"
    />
    <div class="right-buttons-wrapper d-inline-flex">
      <b-button
        v-if="showMove"
        v-b-tooltip.bottom
        class="move-button text-uppercase d-inline-flex align-items-center"
        :class="{ 'button-icon-only': !buttonText }"
        data-qa="item move button"
        :variant="buttonVariant"
        :aria-label="$t('actions.move')"
        :title="$t('account.tooltip.reorder')"
        @mouseleave="hideTooltips"
      >
        <span class="icon-ic-move-xy" />
        {{ buttonText ? $t('actions.move') : '' }}
      </b-button>
      <ItemRemoveButton
        v-if="showRemove"
        data-qa="item remove button"
        :identifier="identifier"
        :button-variant="buttonVariant"
        :button-text="buttonText"
      />
      <ItemAddButton
        data-qa="item add button"
        :identifier="identifier"
        :button-variant="buttonVariant"
        :button-text="buttonText"
      />
      <ItemLikeButton
        v-model="likedItems[identifier]"
        data-qa="item like button"
        :identifier="identifier"
        :button-variant="buttonVariant"
        :button-text="buttonText"
      />
    </div>
  </div>
</template>

<script>
  import ItemAddButton from '@/components/item/ItemAddButton';
  import ItemLikeButton from '@/components/item/ItemLikeButton';
  import ItemPinButton from '@/components/item/ItemPinButton';
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'UserButtons',

    components: {
      ItemAddButton,
      ItemLikeButton,
      ItemPinButton,
      ItemRemoveButton: () => import('@/components/item/ItemRemoveButton.vue')
    },

    inject: {
      likedItems: {
        default: () => ({})
      }
    },

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      // Entities related to the item, used on item page.
      entities: {
        type: Array,
        default: () => []
      },
      /**
       * If `true`, pin button will be rendered
       */
      showPins: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, move button will be rendered
       */
      showMove: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, remove button will be rendered
       */
      showRemove: {
        type: Boolean,
        default: false
      },
      /**
       * Button variant to use for styling the buttons
       */
      buttonVariant: {
        type: String,
        default: 'outline-light'
      },
      /**
       * If `true`, button text will be rendered
       */
      buttonText: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const { hideTooltips } = useHideTooltips();
      return { hideTooltips };
    }
  };
</script>

<docs lang="md">
  Button variant outline-light (default, grid and mosaic ItemPreviewCard)

  ```jsx
    <UserButtons
      identifier="001/item"
      showPins
      showMove
      showRemove
      class="d-flex"
    />
  ```

  Button variant light-flat (list ItemPreviewCard)

  ```jsx
    <UserButtons
      identifier="001/item"
      showPins
      showMove
      showRemove
      button-variant="light-flat"
      :button-text="true"
      class="d-flex"
    />
  ```

  Button variant secondary (ItemHero)

  ```jsx
    <UserButtons
      identifier="001/item"
      showPins
      showMove
      showRemove
      button-variant="secondary"
      class="d-flex"
    />
  ```

  Button variant dark-flat (ItemSelectToolbar)

  ```jsx
    <b-container style="background-color: black; padding: 1rem;">
      <UserButtons
        identifier="001/item"
        showPins
        showMove
        showRemove
        button-variant="dark-flat"
        class="d-flex"
      />
    </b-container>
  ```
</docs>
