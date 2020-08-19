<!-- TODO: l10n; props -->
<template>
  <b-modal
    :id="modalId"
    :title="modalTitle"
    hide-footer
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
          @click="hide"
        >
          {{ isNew ? $t('actions.goBack') : $t('actions.close') }}
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
</template>

<script>
  export default {
    name: 'SetFormModal',

    props: {
      modalId: {
        type: String,
        default: 'set-form-modal'
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
        // TODO: how to handle existing set having title/description in other languages?
        titleValue: (this.title || {})[this.$i18n.locale],
        descriptionValue: (this.description || {})[this.$i18n.locale],
        isPrivate: this.visibility === 'private'
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

    methods: {
      // TODO: error handling
      async submitForm() {
        if (this.isNew) {
          this.$sets.createSet(this.setBody)
            .then(response => {
              this.hide();
              this.$emit('create', response);
            });
        } else {
          this.$sets.updateSet(this.setId, this.setBody)
            .then(response => {
              this.hide();
              this.$emit('update', response);
            });
        }
      },

      hide() {
        this.$bvModal.hide(this.modalId);
      }
    }
  };
</script>
