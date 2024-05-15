<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="remove-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      data-qa="item remove button"
      :aria-label="$t('actions.remove')"
      :title="$t('account.tooltip.remove')"
      @click="removeItem"
    >
      <span class="icon-remove-circle-outlined" />
      {{ buttonText ? $t('actions.remove') : '' }}
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'ItemRemoveButton',

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
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

    methods: {
      async removeItem() {
        const setId = this.$store.state.set.active.id;
        await this.$store.dispatch('set/removeItem', { setId, itemId: this.identifier });
        this.$store.dispatch('set/refreshSet');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .remove-button:hover {
    .icon-remove-circle-outlined::before {
      content: '\e917';
    }
  }
</style>
