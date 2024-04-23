<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="add-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      data-qa="add button"
      :variant="buttonVariant"
      :aria-label="$t('set.actions.addTo')"
      :title="$t('set.actions.addToGallery')"
      @click="addToSet"
    >
      <span class="icon-add-circle-outlined" />
      {{ buttonText ? $t('actions.save') : '' }}
    </b-button>
    <template
      v-if="$auth.loggedIn"
    >
      <SetAddItemModal
        data-qa="add item to set modal"
        :modal-id="addItemToSetModalId"
        :item-id="identifier"
        :new-set-created="newSetCreated"
        @clickCreateSet="clickCreateSet"
        @hideModal="refreshSet"
      />
      <SetFormModal
        :modal-id="setFormModalId"
        :item-context="identifier"
        @response="setCreatedOrUpdated"
      />
    </template>
  </div>
</template>

<script>
  import keycloak from '@/mixins/keycloak';
  import SetAddItemModal from '../set/SetAddItemModal';
  import SetFormModal from '../set/SetFormModal';

  export default {
    name: 'ItemAddButton',

    components: {
      SetAddItemModal,
      SetFormModal
    },

    mixins: [
      keycloak
    ],

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
        newSetCreated: false
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
          this.$bvModal.show(this.addItemToSetModalId);
          this.$matomo?.trackEvent('Item_add', 'Click add item button', this.identifier);
        } else {
          this.keycloakLogin();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .add-button:hover {
    .icon-add-circle-outlined::before {
      content: '\e907';
    }
  }
</style>
