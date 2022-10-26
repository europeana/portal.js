<template>
  <b-container
    fluid
    class="border-bottom align-items-center"
    data-qa="notification banner"
    :class="{'d-none': hide, 'd-flex': !hide }"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 py-3">
          <p class="mb-0">
            {{ notificationText }}
            <a
              :href="notificationUrl"
              class="ml-1"
            >
              {{ notificationLinkText }}
            </a>
          </p>
        </b-col>
      </b-row>
    </b-container>
    <b-button
      v-if="ignorable"
      class="button-icon-only icon-clear"
      variant="light-flat"
      :aria-label="$t('actions.close')"
      @click="hide = !hide"
    />
  </b-container>
</template>

<script>
  export default {
    name: 'NotificationBanner',

    props: {
      notificationUrl: {
        type: String,
        default: null
      },
      notificationText: {
        type: String,
        default: null
      },
      notificationLinkText: {
        type: String,
        default: null
      },
      ignorable: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        hide: false
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .container-fluid {
    p {
      line-height: 1.375rem;
      display: flex;

      &::before {
        content: '\e949';
        font-size: 1.25rem;
        margin-right: 0.75rem;

        @extend %icon-font;
      }
    }

    .icon-clear {
      background: none;
    }
  }
</style>
