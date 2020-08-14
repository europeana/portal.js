<!-- TODO: l10n; props -->
<template>
  <div>
    <h2>Create new collection</h2>
    <b-form @submit.stop.prevent="submitForm">
      <b-form-group
        label="Collection name"
        label-for="collection"
      >
        <b-form-input
          id="collection"
          type="text"
          maxlength="35"
          required
        />
      </b-form-group>
      <b-form-group
        label="Collection description"
        label-for="description"
      >
        <b-form-textarea
          id="description"
          maxlength="240"
        />
      </b-form-group>
      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          @click="goBack()"
        >
          Go back
        </b-button>
        <b-button
          variant="primary"
          type="submit"
        >
          Create collection
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: 'SetForm',

    methods: {
      goBack() {
        // TODO: emit event so that modal collection can hide form
      },

      submitForm() {
        // TODO: - write data to Set API
        //       - emit event so that modal collection can hide form
      }
    }
  };
</script>
