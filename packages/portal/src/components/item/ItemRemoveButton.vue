<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="remove-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :disabled="disabled"
      :variant="buttonVariant"
      data-qa="item remove button"
      :aria-label="$t('actions.remove')"
      :title="tooltipTitle"
      @click="handleClickButton"
    >
      <span class="icon-remove-circle-outlined" />
      {{ buttonText ? $t('actions.remove') : '' }}
    </b-button>
    <ConfirmDangerModal
      v-if="showConfirmationModal"
      v-model="showConfirmationModal"
      :confirm-button-text="$t('actions.remove')"
      :modal-id="modalId"
      :modal-title="modalTitle"
      :prompt-text="modalPromptText"
      data-qa="confirm removal modal"
      @confirm="handleConfirmation"
      @input="showConfirmationModal = $event"
    />
  </div>
</template>

<script>
  import { useCardinality } from '@/composables/cardinality.js';
  import useMakeToast from '@/composables/makeToast.js';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'ItemRemoveButton',

    components: {
      ConfirmDangerModal: () => import('../generic/ConfirmDangerModal')
    },

    inject: {
      currentSet: 'currentSet',
      fetchCurrentSet: {
        default: null
      }
    },

    props: {
      /**
       * Identifier(s) of the item
       */
      identifiers: {
        type: [String, Array],
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

    setup(props) {
      const { cardinality } = useCardinality(props.identifiers);
      const { makeToast } = useMakeToast();
      return { cardinality, makeToast };
    },

    data() {
      return {
        modalId: 'set-confirm-remove-multiple-items',
        showConfirmationModal: false
      };
    },

    computed: {
      disabled() {
        return this.selectionCount === 0;
      },
      confirmationNeeded() {
        // TODO: should we really alway show the confirmation modal just to remove
        //       one item?
        // return Array.isArray(this.identifiers);
        return true;
      },
      modalPromptText() {
        return this.$tc('set.prompts.removeItems', this.selectionCount, { count: this.selectionCount });
      },
      modalTitle() {
        return this.$tc('set.actions.removeItems.many', this.selectionCount, { count: this.selectionCount });
      },
      selectionCount() {
        return Array.isArray(this.identifiers) ? this.identifiers.length : 1;
      },
      tooltipTitle() {
        return this.$tc(`set.actions.removeItems.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      },
      toastMessage() {
        const setTitle = langMapValueForLocale(this.currentSet.title, this.$i18n.locale).values[0];
        return this.$tc(`set.notifications.itemsRemoved.${this.cardinality}`, this.selectionCount, { count: this.selectionCount, gallery: setTitle });
      }
    },

    methods: {
      handleClickButton() {
        if (this.confirmationNeeded) {
          this.showConfirmationModal = true;
        } else {
          this.removeItem();
        }
      },

      handleConfirmation() {
        this.removeItem();
      },

      async removeItem() {
        const setId = this.currentSet.id;

        try {
          await this.$apis.set.deleteItems(setId, this.identifiers);
          this.fetchCurrentSet?.();
          this.makeToast(this.toastMessage);
          this.$emit('remove');
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
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
