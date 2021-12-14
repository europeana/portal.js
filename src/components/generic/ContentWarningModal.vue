<template>
  <b-modal
    id="content-warning-modal"
    :title="title"
    hide-header-close
    hide-footer
    data-qa="share modal"
    visible
  >
    <p>{{ description }}</p>
    <div class="modal-footer pt-2">
      <b-button
        variant="outline-primary"
        :to="$path({ name: 'index' })"
      >
        {{ $t('actions.goHome') }}
      </b-button>
      <b-button
        variant="primary"
        class="continue-button"
        @click="$bvModal.hide('content-warning-modal')"
      >
        {{ $t('actions.continue') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'ContentWarningModal',

    props: {
      title: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
.continue-button {
  float: right;
}
</style>
