<template>
  <div>
    <b-button
      :aria-controls="id"
      :aria-expanded="expanded"
      :disabled="apiKey.state === 'disabled'"
      data-qa="user api key actions menu control button"
      variant="light-flat"
      class="button-icon-only"
      @click="expanded = !expanded"
    >
      <span
        class="icon icon-kebab"
      />
    </b-button>
    <b-list-group
      v-show="expanded"
      :id="id"
      data-qa="user api key actions menu"
      deck
    >
      <b-list-group-item
        v-if="apiKey.state !== 'disabled'"
      >
        <b-button
          data-qa="disable personal api key button"
          @click="handleClickDisableButton(apiKey)"
        >
          {{ $t('actions.disable') }}
        </b-button>
      </b-list-group-item>
    </b-list-group>
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
