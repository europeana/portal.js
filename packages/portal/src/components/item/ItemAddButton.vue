<template>
  <div>
    <b-button
      :id="`item-add-button-${identifier}`"
      ref="itemAddButton"
      class="add-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="add button"
      :variant="buttonVariant"
      :aria-label="$t('set.actions.addTo')"
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
      :target="`item-add-button-${identifier}`"
      placement="bottom"
      @show="(e) => { if (!showTooltip) { e.preventDefault() } } "
    >
      {{ $t('set.actions.addToGallery') }}
    </b-tooltip>
    <template
      v-if="$auth.loggedIn"
    >
      <SetAddItemModal
        data-qa="add item to set modal"
        :modal-id="addItemToSetModalId"
        :item-id="identifier"
        :new-set-created="newSetCreated"
        @clickCreateSet="clickCreateSet"
        @hideModal="handleHideModal"
      />
      <SetFormModal
        :modal-id="setFormModalId"
        :item-id="identifier"
        @response="setCreatedOrUpdated"
      />
    </template>
  </div>
</template>

<script>
  import SetAddItemModal from '../set/SetAddItemModal';
  import SetFormModal from '../set/SetFormModal';

  export default {
    name: 'ItemAddButton',

    components: {
      SetAddItemModal,
      SetFormModal
    },

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

    data() {
      return {
        addItemToSetModalId: `add-item-to-set-modal-${this.identifier}`,
        setFormModalId: `set-form-modal-${this.identifier}`,
        showFormModal: false,
        newSetCreated: false,
        showTooltip: false
      };
    },

    methods: {
      clickCreateSet() {
        if (this.showFormModal === false) {
          this.showFormModal = true;
          this.newSetCreated = false;
          this.$bvModal.hide(this.addItemToSetModalId);
          this.$bvModal.show(this.setFormModalId);
        }
      },
      setCreatedOrUpdated() {
        this.showFormModal = false;
        this.newSetCreated = true;
        this.$bvModal.show(this.addItemToSetModalId);
      },
      refreshSet() {
        if (!this.showFormModal) {
          this.$store.dispatch('set/refreshSet');
        }
      },
      addToSet() {
        if (this.$auth.loggedIn) {
          this.showTooltip = false; // Fix for touch devices that keep the tooltip open, overlaying the modal
          this.$bvModal.show(this.addItemToSetModalId);
          this.$matomo?.trackEvent('Item_add', 'Click add item button', this.identifier);
        } else {
          this.$keycloak.login();
        }
      },
      async handleHideModal() {
        this.refreshSet();
        // Sets focus back to the toggle button, as this functionality is lost when opening the SetFormModal.
        this.$refs.itemAddButton.focus();
        // Do not show the tooltip when focus returns to button.
        this.showTooltip = false;
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
