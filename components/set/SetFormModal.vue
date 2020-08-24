<template>
  <b-container>
    <b-modal
      :id="modalId"
      :title="modalTitle"
      :static="modalStatic"
      hide-footer
      @show="init"
      @hide="$emit('hide')"
    >
      <b-form @submit.stop.prevent="submitForm">
        <b-form-group
          :label="$t('set.form.title')"
          label-for="set-title"
        >
          <b-form-input
            id="set-title"
            v-model="titleValue"
            type="text"
            maxlength="35"
            required
          />
        </b-form-group>
        <b-form-group
          :label="$t('set.form.description')"
          label-for="set-description"
        >
          <b-form-textarea
            id="set-description"
            v-model="descriptionValue"
            maxlength="240"
            rows="4"
          />
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            id="set-private"
            v-model="isPrivate"
          >
            {{ $t('set.form.private') }}
          </b-form-checkbox>
        </b-form-group>
        <div class="modal-footer">
          <b-button
            variant="outline-primary"
            data-qa="close button"
            @click="hide"
          >
            {{ isNew ? $t('actions.goBack') : $t('actions.close') }}
          </b-button>
          <b-button
            v-if="!isNew"
            variant="danger"
            data-qa="delete button"
            @click="clickDelete"
          >
            {{ $t('set.actions.delete') }}
          </b-button>
          <b-button
            variant="primary"
            type="submit"
          >
            {{ isNew ? $t('set.actions.create') : $t('set.actions.update') }}
          </b-button>
        </div>
      </b-form>
    </b-modal>
    <DeleteSetModal
      v-if="!isNew"
      :set-id="setId"
      :modal-id="deleteSetModalId"
      :modal-static="modalStatic"
      @cancel="cancelDelete"
    />
  </b-container>
</template>

<script>
  export default {
    name: 'SetFormModal',

    components: {
      DeleteSetModal: () => import('./DeleteSetModal')
    },

    props: {
      modalId: {
        type: String,
        default: 'set-form-modal'
      },

      modalStatic: {
        type: Boolean,
        default: false
      },

      setId: {
        type: String,
        default: null
      },

      title: {
        type: Object,
        default: () => {}
      },

      description: {
        type: Object,
        default: () => {}
      },

      visibility: {
        type: String,
        default: 'public'
      },

      type: {
        type: String,
        default: 'Collection'
      }
    },

    data() {
      return {
        titleValue: '',
        descriptionValue: '',
        isPrivate: false,
        deleteSetModalId: `delete-set-modal-${this.setId}`
      };
    },

    computed: {
      setBody() {
        const setBody = {
          type: this.type,
          title: this.title || {},
          description: this.description || {},
          visibility: this.isPrivate ? 'private' : 'public'
        };
        setBody.title[this.$i18n.locale] = this.titleValue;
        setBody.description[this.$i18n.locale] = this.descriptionValue;

        return setBody;
      },

      isNew() {
        return this.setId === null;
      },

      modalTitle() {
        return this.isNew ? this.$t('set.actions.create') : this.$t('set.actions.edit');
      }
    },

    created() {
      this.init();
    },

    methods: {
      // TODO: how to handle existing set having title/description in other languages?
      init() {
        this.titleValue = (this.title || {})[this.$i18n.locale];
        this.descriptionValue = (this.description || {})[this.$i18n.locale];
        this.isPrivate = this.visibility === 'private';
      },

      // TODO: error handling
      async submitForm() {
        if (this.isNew) {
          this.$sets.createSet(this.setBody)
            .then(response => {
              this.$store.commit('set/timestamp', {
                action: 'created',
                id: response.id
              });

              this.hide();
            });
        } else {
          this.$sets.updateSet(this.setId, this.setBody)
            .then(response => {
              this.$store.commit('set/timestamp', {
                action: 'updated',
                id: response.id
              });

              this.hide();
            });
        }
      },

      show() {
        this.$bvModal.show(this.modalId);
      },

      hide() {
        this.$bvModal.hide(this.modalId);
      },

      clickDelete() {
        this.hide();
        this.$bvModal.show(this.deleteSetModalId);
      },

      cancelDelete() {
        this.show();
      }
    }
  };
</script>
