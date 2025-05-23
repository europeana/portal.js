<template>
  <b-table
    :fields="tableFields"
    :items="sortedApiKeys"
    :tbody-tr-class="tableRowClass"
    striped
    class="borderless api-keys-table"
  >
    <template #cell(created)="data">
      <time :aria-disabled="isDisabled(data.item)">
        {{ data.value && $d(new Date(data.value), 'numeric', $i18n.localeProperties.iso) }}
      </time>
    </template>
    <template #cell(client_id)="data">
      <span
        v-if="isDisabled(data.item)"
        class="disabled"
        aria-disabled="true"
      >
        {{ data.value }}
        <span class="font-italic text-lowercase">- {{ $t('statuses.disabled') }}</span>
      </span>
      <template v-else>
        {{ data.value }}
      </template>
    </template>
    <template #cell(actions)="data">
      <UserApiKeyActionsMenu
        v-if="data.item"
        :id="`api-key-actions-menu-${data.index}`"
        :api-key="data.item"
        @disable="handleDisableApiKey"
      />
    </template>
  </b-table>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import UserApiKeyActionsMenu from '@/components/user/UserApiKeyActionsMenu';

  export default {
    name: 'UserApiKeysTable',

    components: {
      BTable,
      UserApiKeyActionsMenu
    },

    props: {
      apiKeys: {
        type: Array,
        default: () => []
      },
      isDisabled: {
        type: Function,
        default: null
      },
      type: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        tableFields: [
          { key: 'created',
            label: this.$t('apiKeys.table.fields.created.label'),
            sortable: true },
          { class: 'table-api-key-cell',
            key: 'client_id',
            label: this.$t('apiKeys.table.fields.clientId.label') },
          this.type === 'project' &&
            { class: 'table-name-cell',
              key: 'name',
              label: this.$t('apiKeys.table.fields.name.label') },
          { class: 'table-actions-cell',
            key: 'actions',
            label: this.$t('apiKeys.table.fields.actions.label'),
            thClass: 'sr-only' }
        ]
      };
    },

    computed: {

      sortedApiKeys() {
        return [...this.apiKeys].sort(this.sortByEnabled);
      }
    },

    methods: {
      handleDisableApiKey() {
        this.$emit('keyDisabled');
      },

      tableRowClass(item, type) {
        if (type === 'row' && this.isDisabled(item)) {
          return 'disabled';
        }
        return undefined;
      },

      sortByEnabled(a, b) {
        const isADisabled = this.isDisabled(a);
        const isBDisabled = this.isDisabled(b);

        if (isADisabled === isBDisabled) {
          return 0;
        }
        return isADisabled ? 1 : -1;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/table';

  .table.api-keys-table {
    thead th {
      padding: 1.5rem 1rem;

      @media (max-width: ($bp-small - 1px)) {
        padding-right: 0 !important;
      }

      @media (min-width: $bp-small) {
        padding-right: 3rem !important;
      }

      @media (min-width: $bp-4k) {
        padding-right: 4.5rem !important;
      }

      &.table-api-key-cell {
        @media (min-width: $bp-small) {
          width: 100%;
        }
      }

      div {
        @media (max-width: ($bp-small - 1px)) {
          overflow-wrap: anywhere;
          white-space: wrap;
        }
      }
    }

    td {
      font-weight: 600;
      color: $darkgrey;
      line-height: 1.5;
      padding: 1.5rem 1rem;

      &.table-actions-cell {
        padding: 0;
        vertical-align: middle;
      }

      .dropdown-toggle {
        font-size: $font-size-large;
        padding-top: 0;
        padding-bottom: 0;

        @media (min-width: $bp-4k) {
          font-size: $font-size-large-4k;
        }
      }

      .dropdown-menu {
        box-shadow: $boxshadow-large;
        border: none;
        border-radius: 0 0 $border-radius $border-radius;

        // dropdown is flipped up
        &[x-placement='top-end'] {
          border-radius: $border-radius $border-radius 0 0;
        }
      }

      .btn-link:focus, .btn-link:hover {
        text-decoration: none;
      }
      .btn:focus {
        box-shadow: none;
      }
    }

    tr {
      &.disabled {
        &:nth-of-type(2n+1) {
          background-color: rgba($lightergrey, 0.7);
        }

        td {
          opacity: 0.7;

          &.table-actions-cell {
            opacity: 1;
          }
        }
      }

      &:last-child td {
        border-bottom: 1px solid $middlegrey;
      }
    }
  }
</style>
