<template>
  <b-card
    class="text-center content-card create-card"
    no-body
    data-qa="create new gallery card"
    @click="clickCreateSet"
  >
    <div class="card-inner d-flex justify-content-center align-items-center">
      <span class="icon-ic-add" />
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
  export default {
    name: 'CreateSetButton',

    components: {
      SetFormModal: () => import('../set/SetFormModal')
    },

    props: {
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
      }
    }
  };
</script>
