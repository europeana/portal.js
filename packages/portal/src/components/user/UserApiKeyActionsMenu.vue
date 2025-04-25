<template>
  <div>
    <b-dropdown
      :id="id"
      :aria-expanded="expanded"
      data-qa="user api key actions menu"
      variant="link"
      :disabled="apiKey.state === 'disabled'"
      no-caret
    >
      <template #button-content>
        <span
          class="icon icon-kebab"
        />
      </template>
      <b-dropdown-item
        v-if="apiKey.state !== 'disabled'"
        data-qa="disable personal api key button"
        @click="handleClickDisableButton(apiKey)"
      >
        {{ $t('actions.disable') }}
      </b-dropdown-item>
    </b-dropdown>
    <ConfirmDangerModal
      v-if="showConfirmDangerModal"
      v-model="showConfirmDangerModal"
      :confirm-button-text="$t('apiKeys.disable.confirm')"
      :modal-id="`${id}-confirm-disable-modal`"
      :modal-title="$t('apiKeys.disable.title')"
      :prompt-text="[$t('apiKeys.disable.promptText1'), $t('apiKeys.disable.promptText2')]"
      data-qa="confirm disable api key modal"
      @confirm="handleConfirmDisableKey"
      @input="showConfirmDangerModal = $event"
    />
  </div>
</template>

<script>
  export default {
    name: 'UserApiKeyActionsMenu',

    components: {
      ConfirmDangerModal: () => import('@/components/generic/ConfirmDangerModal')
    },

    props: {
      apiKey: {
        type: Object,
        required: true
      },

      id: {
        type: String,
        default: 'api-key-actions-menu'
      }
    },

    data() {
      return {
        expanded: false,
        showConfirmDangerModal: false
      };
    },

    methods: {
      handleClickDisableButton() {
        this.showConfirmDangerModal = true;
      },

      async handleConfirmDisableKey() {
        await this.$apis.auth.deleteClient(this.apiKey.id);
        this.$emit('disable');
      }
    }
  };
</script>
