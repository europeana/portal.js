<template>
  <b-card
    class="text-center content-card create-card"
    no-body
    data-qa="create new gallery card"
    @click="clickCreateSet"
  >
    <div class="card-inner d-flex justify-content-center align-items-center">
      <span class="icon-add-circle-outlined" />
      <b-card-body data-qa="card body">
        <b-card-title title-tag="div">
          {{ $t('set.actions.createNew') }}
        </b-card-title>
      </b-card-body>
    </div>
    <SetFormModal
      :modal-id="setFormModalId"
      :visibility="visibility"
      @response="setCreated"
    />
  </b-card>
</template>

<script>
  /**
   * Button for initiating creation of a user set (AKA gallery).
   */
  export default {
    name: 'UserCreateSetButton',

    components: {
      SetFormModal: () => import('../set/SetFormModal')
    },

    props: {
      /**
       * Visibility of the set
       * @values public, private
       */
      visibility: {
        type: String,
        default: 'public'
      }
    },

    data() {
      return {
        setFormModalId: `set-form-modal-${this.visibility}`,
        showFormModal: false
      };
    },

    methods: {
      clickCreateSet() {
        if (!this.showFormModal) {
          this.showFormModal = true;
          this.$bvModal.show(this.setFormModalId);
        }
      },
      setCreated() {
        this.showFormModal = false;
        this.$emit('created');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .create-card:hover {
    .icon-add-circle-outlined::before {
      content: '\e907';
    }
  }
</style>

<docs lang="md">
  ```jsx
  <UserCreateSetButton />
  ```
</docs>
