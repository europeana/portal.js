<template>
  <b-container
    fluid
    class="notification-banner border-bottom align-items-center"
    data-qa="notification banner"
    :class="{'d-none': hide, 'd-flex': !hide }"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 py-3">
          <p class="mb-0">
            {{ notificationText }}
            <a
              v-if="notificationUrl && notificationLinkText"
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
      /**
       * URL that linktext will link to
       */
      notificationUrl: {
        type: String,
        default: null
      },
      /**
       * Notification message that explains the issue
       */
      notificationText: {
        type: String,
        default: null
      },
      /**
       * Text that forms a link. Placed after notification text
       */
      notificationLinkText: {
        type: String,
        default: null
      },
      /**
       * If `true` a close button will be added which when clicked will hide the notification banner
       */
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
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .container-fluid {
    background-color: $lightgrey;
    margin-top: -1rem;
    position: relative;
    z-index: 100;
    margin-bottom: 1rem;

    p {
      line-height: 1.375rem;
      display: flex;
      align-items: center;

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

<docs lang="md">
With a link
  ```jsx
  <NotificationBanner
    notification-url="https://www.europeana.eu"
    notification-text="You're viewing the new Europeana experience."
    notification-link-text="Go to Europeana"
    :ignorable="false"
  />
  ```

  With a close button
  ```jsx
  <NotificationBanner
    notification-text="This is a notification about something you should know about the website"
  />
  ```
  </docs>
