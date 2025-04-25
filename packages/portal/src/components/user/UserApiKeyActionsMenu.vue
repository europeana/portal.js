<template>
  <div>
    <b-dropdown
      :id="id"
      :aria-expanded="expanded"
      data-qa="user api key actions menu"
      variant="link"
      no-caret
    >
      <template #button-content>
        <span
          class="icon icon-kebab"
        />
      </template>
      <b-dropdown-item
        v-if="apiKey.state === 'disabled'"
        data-qa="re-enable personal api key button"
        @click="handleClickReEnableButton(apiKey)"
      >
        {{ $t('apiKeys.actions.reEnable') }}
      </b-dropdown-item>
      <b-dropdown-item
        v-else
        data-qa="disable personal api key button"
        @click="handleClickDisableButton(apiKey)"
      >
        {{ $t('apiKeys.actions.disable') }}
      </b-dropdown-item>
    </b-dropdown>
    <ConfirmDangerModal
      v-if="showConfirmDangerModal"
      v-model="showConfirmDangerModal"
      :confirm-button-text="$t('apiKeys.actions.disable')"
      :modal-id="`${id}-confirm-disable-modal`"
      :modal-title="$t('apiKeys.disable.title')"
      :prompt-text="[$t('apiKeys.disable.promptText1'), $t('apiKeys.disable.promptText2')]"
      data-qa="confirm disable api key modal"
      @confirm="handleConfirmDisableKey"
      @input="showConfirmDangerModal = $event"
    />
    <b-modal
      v-if="showUserReEnableApiKeyModal"
      id="user-re-enable-api-key-modal"
      v-model="showUserReEnableApiKeyModal"
      title-tag="h2"
      :title="$t('apiKeys.reEnable.title')"
      header-tag="div"
      hide-header-close
      hide-footer
      data-qa="re-enable api key info modal"
    >
      <p>
        {{ $t('apiKeys.reEnable.text') }}
      </p>
      <b-button
        variant="outline-primary"
        @click="$bvModal.hide('user-re-enable-api-key-modal')"
      >
        {{ $t('actions.close') }}
      </b-button>
    </b-modal>
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
        showConfirmDangerModal: false,
        showUserReEnableApiKeyModal: false
      };
    },

    methods: {
      handleClickDisableButton() {
        this.showConfirmDangerModal = true;
      },

      handleClickReEnableButton() {
        this.showUserReEnableApiKeyModal = true;
      },

      async handleConfirmDisableKey() {
        await this.$apis.auth.deleteClient(this.apiKey.id);
        this.$emit('disable');
      }
    }
  };
</script>
