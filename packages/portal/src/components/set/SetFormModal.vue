<template>
  <div>
    <b-modal
      :id="modalId"
      :title="modalTitle"
      :static="modalStatic"
      hide-footer
      hide-header-close
      @show="init"
      @hide="$emit('response', 'cancel')"
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
            maxlength="100"
            :required="!hasTitleInSomeLanguage"
            aria-describedby="input-live-help"
          />
          <b-form-text
            v-show="!hasTitleInSomeLanguage"
            id="input-live-help"
          >
            {{ $t('set.form.required') }}
          </b-form-text>
        </b-form-group>
        <b-form-group
          :label="$t('set.form.description')"
          label-for="set-description"
        >
          <b-form-textarea
            id="set-description"
            v-model="descriptionValue"
            maxlength="500"
            rows="4"
          />
        </b-form-group>
        <b-form-group
          v-if="type === 'Collection'"
          class="mb-2 mt-4"
        >
          <b-form-checkbox
            id="set-private"
            v-model="isPrivate"
          >
            {{ $t('set.form.private') }}
          </b-form-checkbox>
          <b-form-invalid-feedback
            v-if="visibility === 'published'"
            :state="!isPrivate"
          >
            {{ $t('set.form.privateWarning') }}
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="modal-footer">
          <b-button
            variant="outline-primary"
            data-qa="close button"
            @click="hide('cancel')"
          >
            {{ isNew && itemContext ? $t('actions.cancel') : $t('actions.close') }}
          </b-button>
          <div class="d-flex">
            <b-button
              v-if="displayDeleteButton"
              variant="danger"
              data-qa="delete button"
              @click="clickDelete"
            >
              {{ $t('set.actions.delete') }}
            </b-button>
            <b-button
              variant="primary"
              type="submit"
              :disabled="disableSubmitButton"
              data-qa="submit button"
            >
              {{ isNew ? $t('set.actions.create') : $t('set.actions.update') }}
            </b-button>
          </div>
        </div>
      </b-form>
    </b-modal>
    <SetDeleteModal
      v-if="!isNew"
      :set-id="setId"
      :modal-id="deleteSetModalId"
      :modal-static="modalStatic"
      @cancel="show"
    />
  </div>
</template>

<script>
  import {
    EUROPEANA_SET_VISIBILITY_PRIVATE,
    EUROPEANA_SET_VISIBILITY_PUBLIC,
    EUROPEANA_SET_VISIBILITY_PUBLISHED
  } from '@europeana/apis/src/apis/set.js';

  export default {
    name: 'SetFormModal',

    components: {
      SetDeleteModal: () => import('./SetDeleteModal')
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
        default: () => ({})
      },

      description: {
        type: Object,
        default: () => ({})
      },

      userIsOwner: {
        type: Boolean,
        default: true
      },

      visibility: {
        type: String,
        default: EUROPEANA_SET_VISIBILITY_PUBLIC
      },

      type: {
        type: String,
        default: 'Collection'
      },

      itemContext: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        titleValue: '',
        descriptionValue: '',
        isPrivate: false,
        submissionPending: false,
        deleteSetModalId: `delete-set-modal-${this.setId}`
      };
    },

    computed: {
      setBody() {
        const setBody = {
          type: this.type,
          title: {
            ...this.title,
            [this.$i18n.locale]: this.titleValue
          },
          description: {
            ...this.description,
            [this.$i18n.locale]: this.descriptionValue
          },
          visibility: this.visibilityValue
        };

        if (this.isNew && this.itemContext) {
          setBody.items = ['http://data.europeana.eu/item' + this.itemContext];
        }

        return setBody;
      },

      visibilityValue() {
        if (this.isPrivate) {
          return EUROPEANA_SET_VISIBILITY_PRIVATE;
        } else if (this.visibility === EUROPEANA_SET_VISIBILITY_PUBLISHED) {
          return EUROPEANA_SET_VISIBILITY_PUBLISHED;
        } else {
          return EUROPEANA_SET_VISIBILITY_PUBLIC;
        }
      },

      isNew() {
        return this.setId === null;
      },

      modalTitle() {
        return this.isNew ? this.$t('set.actions.create') : this.$t('set.actions.edit');
      },

      displayDeleteButton() {
        // Display if this is an existing set and the user owns it.
        return !this.isNew && this.userIsOwner;
      },

      disableSubmitButton() {
        // Disable submit button when no title (required field)
        return !this.hasTitleInSomeLanguage;
      },

      hasTitleInSomeLanguage() {
        const titleValues = { ...this.title, [this.$i18n.locale]: this.titleValue };
        return Object.values(titleValues).some((val) => !!val);
      }
    },

    created() {
      this.init();
    },

    methods: {
      // TODO: how to handle existing set having title/description in other languages?
      init() {
        this.titleValue = this.title?.[this.$i18n.locale];
        this.descriptionValue = this.description?.[this.$i18n.locale];
        this.isPrivate = this.visibility === EUROPEANA_SET_VISIBILITY_PRIVATE;
      },

      // TODO: error handling other statuses
      submitForm() {
        if (this.submissionPending) {
          return Promise.resolve();
        }
        this.submissionPending = true;
        const handler = this.isNew ?
          this.$store.dispatch('set/createSet', this.setBody) :
          this.$store.dispatch('set/update', { id: this.setId, body: this.setBody });

        return handler
          .then(() => {
            this.hide(this.isNew ? 'create' : 'update');
          }).then(() => {
            this.submissionPending = false;
          }).catch((e) => {
            this.$error(e, { scope: 'gallery' });
          });
      },

      show() {
        this.$bvModal.show(this.modalId);
      },

      hide(signalType) {
        this.$emit('response', signalType);
        this.$bvModal.hide(this.modalId);
      },

      clickDelete() {
        this.$bvModal.hide(this.modalId);
        this.$bvModal.show(this.deleteSetModalId);
      }
    }
  };
</script>
