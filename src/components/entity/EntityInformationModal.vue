<template>
  <b-modal
    id="entityInformationModal"
    :title="title.values[0]"
    :lang="title.code"
    :static="modalStatic"
    hide-footer
    hide-header-close
  >
    <ul class="mb-2 p-0">
      <li
        v-for="(info, index) in entityInfo"
        :key="index"
        class="entity-data-row d-flex flex-wrap justify-content-between"
      >
        <span>
          {{ info.label }}
        </span>
        <span
          v-if="info.value.values"
          :lang="info.value.code"
          class="semibold"
        >
          {{ info.value.values[0] }}
        </span>
        <span
          v-else
          class="semibold"
        >
          {{ info.value }}
        </span>
      </li>
    </ul>
    <b-button
      variant="outline-primary"
      @click="$bvModal.hide('entityInformationModal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>

  export default {
    name: 'EntityInformationModal',

    props: {
      modalStatic: {
        type: Boolean,
        default: false
      },
      title: {
        type: Object,
        default: null
      },
      entityInfo: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .entity-data-row {
    border-bottom: 1px solid $bodygrey;
    padding: 1rem 0;
    list-style: none;

    &:last-child {
      border-bottom: none;
    }

    .semibold {
      font-weight: 600;
    }
  }
</style>
