<template>
  <portal to="toaster-bottom-left">
    <div
      ref="toast"
      class="toast"
      :class="toastClass"
      :role="isStatus ? 'status' : 'alert'"
      :aria-live="isStatus ? 'polite' : 'assertive'"
      aria-atomic="true"
      :data-bs-autohide="autoHide ? 'true' : 'false'"
      :data-bs-delay="autoHideDelay"
    >
      <div class="toast-body p-3">
        <slot />
      </div>
    </div>
  </portal>
</template>

<script>
  export default {
    name: 'BToast',

    props: {
      isStatus: {
        type: Boolean,
        default: true
      },
      autoHide: {
        type: Boolean,
        default: true
      },
      autoHideDelay: {
        type: Number,
        default: 5000
      },
      toastClass: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        toastComponent: null
      };
    },

    async mounted() {
      if (this.visible) {
        // wait for portal to mount and this.$refs.toast to be available
        await this.$nextTick();

        this.toastComponent = new window.bootstrap.Toast(this.$refs.toast);
        this.toastComponent.show();
      }
    },

    methods: {
      hide() {
        this.toastComponent.hide();
      },
      show() {
        this.toastComponent.show();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .toast {
    border-radius: $border-radius-small;
    border: 0;

    .btn {
      text-decoration: none;
    }
  }

  .brand-toast {
    background: $blue;
    color: $white;

    &-white {
      background: $white;
      color: $greyblack;
      box-shadow: 0 4px 6px 0 rgb(0 0 0 / 20%), 5px 5px 10px 0 rgb(0 0 0 / 20%);

      a:not(.btn) {
        color: $blue;
        text-decoration: none;
      }
    }
  }
</style>
