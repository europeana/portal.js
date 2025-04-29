<template>
  <div>
    <b-dropdown
      :id="id"
      :aria-expanded="expanded"
      data-qa="user api key actions menu"
      right
      variant="link"
      no-caret
      :toggle-attrs="{ 'aria-label': ariaLabelToggle}"
      @show="menuOpen = true"
      @hide="menuOpen= false"
    >
      <template #button-content>
        <span
          class="icon icon-kebab"
        />
      </template>
      <b-dropdown-item-button
        v-if="apiKey.state === 'disabled'"
        data-qa="re-enable personal api key button"
        @click="handleClickReEnableButton(apiKey)"
      >
        {{ $t('apiKeys.actions.reEnable') }}
      </b-dropdown-item-button>
      <b-dropdown-item-button
        v-else
        data-qa="disable personal api key button"
        @click="handleClickDisableButton(apiKey)"
      >
        {{ $t('apiKeys.actions.disable') }}
      </b-dropdown-item-button>
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
        menuOpen: false,
        showConfirmDangerModal: false,
        showUserReEnableApiKeyModal: false
      };
    },

    computed: {
      ariaLabelToggle() {
        return this.menuOpen ? this.$t('apiKeys.actions.closeMenu') : this.$t('apiKeys.actions.showMenu');
      }
    },

    methods: {
      handleClickDisableButton() {
        this.showConfirmDangerModal = true;
      },

      handleClickReEnableButton() {
        this.showUserReEnableApiKeyModal = true;
      },

      async handleConfirmDisableKey() {
        try {
          await this.$apis.auth.deleteClient(this.apiKey.id);
          this.$emit('disable');
        } catch (error) {
          this.$error(error);
          if (error.code === 'authClientDisabled') {
            this.$emit('disable');
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .dropdown-toggle {
      color: $black;

    &:hover {
      color: $blue;
    }

    .icon-kebab {
      color: inherit;
    }
  }

  ::v-deep .dropdown-item {
    font-size: $font-size-small;

    @media (min-width: $bp-4k) {
      font-size: $font-size-small-4k;
    }
  }
</style>
