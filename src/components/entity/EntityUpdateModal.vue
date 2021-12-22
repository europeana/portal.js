<template>
  <b-modal
    id="entityUpdateModal"
    :title="$t('collections.actions.edit')"
    :static="modalStatic"
    hide-footer
    hide-header-close
    @show="init"
  >
    <b-form @submit.stop.prevent="submitForm">
      <b-form-group
        :label="$t('collections.form.description')"
        label-for="entity-description"
      >
        <b-form-textarea
          id="entity-description"
          v-model="descriptionValue"
          maxlength="240"
          rows="4"
        />
      </b-form-group>
      <div class="modal-footer pt-2">
        <b-button
          variant="outline-primary"
          @click="$bvModal.hide('entityUpdateModal')"
        >
          {{ $t('actions.close') }}
        </b-button>
        <b-button
          variant="primary"
          type="submit"
          :disabled="disableSubmit"
          data-qa="submit button"
        >
          {{ $t('collections.actions.update') }}
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'EntityUpdateModal',

    mixins: [
      makeToastMixin
    ],

    props: {
      modalStatic: {
        type: Boolean,
        default: false
      },
      body: {
        type: Object,
        default: () => ({})
      },
      description: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        descriptionValue: '',
        toastMsg: this.$t('collections.notifications.update')
      };
    },

    computed: {
      entityBody() {
        const entityBody = {
          type: this.body.type,
          prefLabel: { ...this.body.prefLabel },
          note: { ...this.body.note }
        };
        entityBody.note[this.$i18n.locale] = [this.descriptionValue];
        return entityBody;
      },
      disableSubmit() {
        // Disable submit button when description is not changed
        return (this.descriptionValue === '' && this.description === null) ||
          (this.descriptionValue === this.description);
      }
    },

    created() {
      this.init();
    },

    methods: {
      init() {
        this.descriptionValue = this.description ? this.description : this.descriptionValue;
      },
      submitForm() {
        const handler = this.$store.dispatch('entity/update', { id: this.body.id, body: this.entityBody });
        return handler
          .then(() => {
            this.$bvModal.hide('entityUpdateModal');
            this.makeToast(this.toastMsg);
          })
          .catch(e => {
            throw e;
          });
      }

    }
  };
</script>
