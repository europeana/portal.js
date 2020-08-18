<!-- TODO: l10n; props -->
<template>
  <b-form @submit.stop.prevent="submitForm">
    <b-form-group
      :label="$t('collectionModal.collectionName')"
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
      :label="$t('collectionModal.collectionDescription')"
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
        {{ $t('collectionModal.collectionPrivate') }}
      </b-form-checkbox>
    </b-form-group>
    <!-- TODO: use modal slot? except the modal isn't in this component... -->
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        @click="$emit('close')"
      >
        {{ isNew ? $t('actions.goBack') : $t('actions.close') }}
      </b-button>
      <b-button
        variant="primary"
        type="submit"
      >
        {{ isNew ? $t('collectionModal.createCollection') : $t('collectionModal.updateCollection') }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
  export default {
    name: 'SetForm',

    props: {
      id: {
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
        return this.id === null;
      }
    },

    methods: {
      // TODO: error handling
      async submitForm() {
        if (this.isNew) {
          this.$sets.createSet(this.setBody)
            .then(response => {
              this.$emit('create', response);
            });
        } else {
          this.$sets.updateSet(this.id, this.setBody)
            .then(response => {
              this.$emit('update', response);
            });
        }
      }
    }
  };
</script>
