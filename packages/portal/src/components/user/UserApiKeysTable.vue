<template>
  <b-table
    :fields="tableFields"
    :items="sortedApiKeys"
    :tbody-tr-class="tableRowClass"
    striped
    class="borderless"
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
