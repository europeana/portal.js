<template>
  <b-modal
    id="entityUpdateModal"
    :title="$t('collections.actions.edit')"
    :static="modalStatic"
    hide-footer
    hide-header-close
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
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'EntityUpdateModal',

    props: {
      id: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: null
      },
      modalStatic: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    data() {
      return {
        descriptionValue: this.description,
        entity: null,
        toastMsg: this.$t('collections.notifications.update')
      };
    },

    computed: {
      disableSubmit() {
        // Disable submit button when description is not changed
        return (this.descriptionValue === '' && this.description === null) ||
          (this.descriptionValue === this.description);
      },
      descriptionFieldName() {
        return this.id.includes('/concept/') ? 'note' : 'description';
      },
      descriptionFieldIsArray() {
        return this.id.includes('/concept/');
      },
      descriptionFieldValue() {
        return this.descriptionFieldIsArray ? [this.descriptionValue] : this.descriptionValue;
      },
      europeanaProxy() {
        return this.entity?.proxies?.find(proxy => proxy.id.endsWith('#proxy_europeana'));
      },
      updatedBody() {
        return {
          ...this.europeanaProxy,
          [this.descriptionFieldName]: {
            ...this.europeanaProxy[this.descriptionFieldName] || {},
            [this.$i18n.locale]: this.descriptionFieldValue
          }
        };
      }
    },

    methods: {
      async updateEntity() {
        // First fetch the entity to get its Europeana proxy to avoid data loss
        this.entity = await this.$apis.entityManagement.get(this.id);

        return this.$apis.entityManagement.update(this.id, this.updatedBody);
      },
      async submitForm() {
        await this.updateEntity();
        this.$bvModal.hide('entityUpdateModal');
        this.makeToast(this.toastMsg);
        this.$emit('updated');
      }
    }
  };
</script>
