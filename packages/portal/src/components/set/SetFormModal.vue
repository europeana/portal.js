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
            {{ isNew && itemIds ? $t('actions.cancel') : $t('actions.close') }}
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
    <ConfirmDangerModal
      v-if="!isNew"
      :confirm-button-text="$t('set.actions.delete')"
      :modal-id="deleteSetModalId"
      :modal-static="modalStatic"
      :modal-title="$t('set.actions.delete')"
      :prompt-text="$t('set.prompts.delete')"
      @cancel="show"
      @confirm="deleteSet"
    />
  </div>
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';
  import {
    EUROPEANA_SET_VISIBILITY_PRIVATE,
    EUROPEANA_SET_VISIBILITY_PUBLIC,
    EUROPEANA_SET_VISIBILITY_PUBLISHED
  } from '@/plugins/europeana/set';

  export default {
    name: 'SetFormModal',

    components: {
      ConfirmDangerModal: () => import('../generic/ConfirmDangerModal')
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

      itemIds: {
        type: [String, Array],
        default: null
      }
    },

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
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

        // TODO: reinstate, but for edits too, when logic for differentiating
        //       w/ non-Gallery collections is introduced
        // if (this.isNew) {
        //   if (this.type === 'Collection') {
        //     setBody.collectionType = 'Gallery';
        //   }
        // }

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
      async submitForm() {
        if (this.submissionPending) {
          return;
        }
        this.submissionPending = true;

        try {
          const response = await this.createOrUpdateSet();
          const setId = response.id;

          if (setId === this.$store.state.set.active?.id) {
            this.$store.dispatch('set/fetchActive', setId);
          }

          if (this.itemIds && this.isNew) {
            await this.$apis.set.insertItems(setId, this.itemIds);
          }

          this.hide(this.isNew ? 'create' : 'update');
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        } finally {
          this.submissionPending = false;
        }
      },

      async createOrUpdateSet() {
        if (this.isNew) {
          return this.$apis.set.create(this.setBody);
        } else {
          return this.$apis.set.update(this.setId, this.setBody);
        }
      },

      // TODO: error handling other statuses
      async deleteSet() {
        try {
          await this.$apis.set.delete(this.setId);
          if (this.setId === this.$store.state.set.active?.id) {
            this.$store.commit('set/setActive', null);
          }

          this.makeToast(this.$t('set.notifications.deleted'));

          // redirect away from deleted set page
          if (this.$route.name.startsWith('galleries-all___')) {
            this.$router.push(this.localePath({ name: 'account' }));
          }
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
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
