<!-- TODO: l10n; props -->
<template>
  <b-form @submit.stop.prevent="submitForm">
    <b-form-group
      :label="$t('collectionModal.collectionName')"
      label-for="set-title"
    >
      <b-form-input
        id="set-title"
        v-model="title"
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
        v-model="description"
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
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        @click="goBack()"
      >
        {{ $t('collectionModal.goBack') }}
      </b-button>
      <b-button
        variant="primary"
        type="submit"
      >
        {{ $t('collectionModal.createCollection') }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
  export default {
    name: 'SetForm',

    data() {
      return {
        showForm: false,
        title: '',
        description: '',
        isPrivate: false,
        collections: []
      };
    },

    methods: {
      async submitForm() {
        const setBody = {
          type: 'Collection',
          visibility: this.isPrivate ? 'private' : 'public',
          title: {},
          description: {}
        };
        setBody.title[this.$i18n.locale] = this.title;
        setBody.description[this.$i18n.locale] = this.description;

        // TODO: error handling
        this.$sets.createSet(setBody)
          .then((response) => {
            this.$emit('create', response.id);
          });
      }
    }
  };
</script>
