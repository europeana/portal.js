<template>
  <b-modal
    id="entityInformationModal"
    :static="modalStatic"
    hide-footer
    hide-header-close
  >
    <template #modal-title>
      <span :lang="langAttribute(title.code)">
        {{ title.values[0] }}
      </span>
    </template>
    <ul class="mb-2 p-0">
      <li
        v-for="(info, index) in entityInfo"
        :key="index"
        class="entity-data-row d-flex flex-wrap justify-content-between"
        :data-qa="`${info.label} field`"
      >
        <span>
          {{ info.label }}
        </span>
        <span
          class="semibold"
          :lang="langAttribute(info.lang)"
        >
          <b-link
            v-if="isUrl(info.value)"
            :href="info.value"
            target="_blank"
          >
            {{ info.value }}
          </b-link>
          <template v-else>
            {{ info.value }}
          </template>
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
  import langAttributeMixin from '@/mixins/langAttribute';

  export default {
    name: 'EntityInformationModal',

    mixins: [langAttributeMixin],

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
        type: Array,
        default: null
      }
    },

    methods: {
      isUrl(value) {
        return /^https?:\/\//.test(value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .entity-data-row {
    border-bottom: 1px solid $lightgrey;
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
