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
      id: {
        type: String,
        required: true
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
      disableSubmit() {
        // Disable submit button when description is not changed
        return (this.descriptionValue === '' && this.description === null) ||
          (this.descriptionValue === this.description);
      },
      descriptionFieldName() {
        return this.id.includes('/concept/') ? 'note' : 'description';
      }
    },

    created() {
      this.init();
    },

    methods: {
      init() {
        this.descriptionValue = this.description ? this.description : this.descriptionValue;
      },
      async updateEntity() {
        // First fetch the entity to get its Europeana proxy to avoid data loss
        const entity = await this.$apis.entityManagement.get(this.id);
        const europeanaProxy = entity.proxies.find(proxy => proxy.id.includes('#proxy_europeana')) || {};

        let body = {};
        if (entity.exactMatch) {
          body.exactMatch = entity.exactMatch;
        }
        if (entity.sameAs) {
          body.sameAs = entity.sameAs;
        }
        body = {
          ...body,
          ...europeanaProxy,
          [this.descriptionFieldName]: {
            ...europeanaProxy[this.descriptionFieldName] || {},
            [this.$i18n.locale]: [this.descriptionValue]
          }
        };

        return await this.$apis.entityManagement.update(this.id, body);
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
