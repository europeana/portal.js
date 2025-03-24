<template>
  <div>
    <b-button
      :id="`item-add-button-${idSuffix}`"
      ref="itemAddButton"
      class="add-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="add button"
      :disabled="disabled"
      :variant="buttonVariant"
      :aria-label="tooltipTitle"
      @click="addToSet"
      @focus="showTooltip = true"
      @mouseover="showTooltip = true"
    >
      <span class="icon-add-circle-outlined" />
      {{ buttonText ? $t('actions.save') : '' }}
    </b-button>
    <b-tooltip
      data-qa="add button tooltip"
      :show.sync="showTooltip"
      :target="`item-add-button-${idSuffix}`"
      placement="bottom"
      @show="(e) => { if (!showTooltip) { e.preventDefault() } } "
    >
      {{ tooltipTitle }}
    </b-tooltip>
    <template
      v-if="$auth.loggedIn"
    >
      <SetAddItemModal
        v-if="showAddItemModal"
        v-model="showAddItemModal"
        data-qa="add item to set modal"
        :item-ids="identifiers"
        :new-set-created="newSetCreated"
        @clickCreateSet="clickCreateSet"
        @input="handleModalInput"
      />
      <SetFormModal
        :modal-id="setFormModalId"
        :item-ids="identifiers"
        @response="setCreatedOrUpdated"
      />
    </template>
  </div>
</template>

<script>
  import SetAddItemModal from '../set/SetAddItemModal';
  import SetFormModal from '../set/SetFormModal';
  import { useCardinality } from '@/composables/cardinality.js';

  export default {
    name: 'ItemAddButton',

    components: {
      SetAddItemModal,
      SetFormModal
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
      return { cardinality };
    },

    data() {
      const idSuffix = Array.isArray(this.identifiers) ? 'multi-select' : this.identifiers;

      return {
        idSuffix,
        newSetCreated: false,
        setFormModalId: `set-form-modal-${idSuffix}`,
        showAddItemModal: false,
        showFormModal: false,
        showTooltip: false
      };
    },

    computed: {
      disabled() {
        return this.selectionCount === 0;
      },
      selectionCount() {
        return Array.isArray(this.identifiers) ? this.identifiers.length : 1;
      },
      tooltipTitle() {
        return this.$tc(`set.actions.addItems.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      }
    },

    methods: {
      clickCreateSet() {
        if (this.showFormModal === false) {
          this.showFormModal = true;
          this.newSetCreated = false;
          this.showAddItemModal = false;
          this.$bvModal.show(this.setFormModalId);
        }
      },
      setCreatedOrUpdated() {
        this.showFormModal = false;
        this.newSetCreated = true;
        this.showAddItemModal = true;
      },
      refreshSet() {
        if (!this.showFormModal) {
          this.$store.dispatch('set/fetchActive');
        }
      },
      addToSet() {
        if (this.$auth.loggedIn) {
          this.showTooltip = false; // Fix for touch devices that keep the tooltip open, overlaying the modal
          this.showAddItemModal = true;
          for (const id of [].concat(this.identifiers)) {
            this.$matomo?.trackEvent('Item_add', 'Click add item button', id);
          }
        } else {
          this.$keycloak.login();
        }
      },
      handleModalInput(value) {
        this.showAddItemModal = value;
        if (!value) {
          this.refreshSet();
          // Sets focus back to the toggle button, as this functionality is lost when opening the SetFormModal.
          this.$refs.itemAddButton.focus();
          // Do not show the tooltip when focus returns to button.
          this.showTooltip = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .add-button:hover {
    .icon-add-circle-outlined::before {
      content: '\e907';
    }
  }
</style>
