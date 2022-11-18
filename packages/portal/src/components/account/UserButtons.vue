<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <ItemPinButton
      v-if="showPins"
      data-qa="pin button"
      :identifier="identifier"
      :entities="entities"
      :button-variant="buttonVariant"
      :button-text="buttonText"
    />
    <b-button
      v-if="showMove"
      class="move-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="move button"
      :variant="buttonVariant"
      :aria-label="$t('actions.move')"
    >
      <span class="icon-ic-move-xy" />
      {{ buttonText ? $t('actions.move') : '' }}
    </b-button>
    <ItemAddButton
      data-qa="add button"
      :identifier="identifier"
      :button-variant="buttonVariant"
      :button-text="buttonText"
    />
    <ItemLikeButton
      data-qa="like button"
      :identifier="identifier"
      :button-variant="buttonVariant"
      :button-text="buttonText"
    />
  </div>
</template>

<script>
  import ItemAddButton from '../item/ItemAddButton';
  import ItemLikeButton from '../item/ItemLikeButton';
  import ItemPinButton from '../item/ItemPinButton';

  export default {
    name: 'UserButtons',

    components: {
      ItemAddButton,
      ItemLikeButton,
      ItemPinButton
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
    }
  };
</script>
