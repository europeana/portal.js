<template>
  <b-container
    fluid
    class="notification-banner border-bottom align-items-center"
    data-qa="notification banner"
    :class="{'d-none': hide, 'd-flex': !hide }"
  >
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="py-3"
        >
          <p class="d-flex flex-wrap align-items-center mb-0">
            <span
              v-if="iconClass"
              class="icon align-self-start"
              :class="iconClass"
            />
            {{ text }}
            <a
              v-if="url && linkText"
              :href="url"
              class="ml-1"
            >
              {{ linkText }}
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
       * icon class used to display an icon
       */
      iconClass: {
        type: String,
        default: 'icon-light-bulb'
      },
      /**
       * Notification message that explains the issue
       */
      text: {
        type: String,
        default: null
      },
      /**
       * URL that linktext will link to
       */
      url: {
        type: String,
        default: null
      },
      /**
       * Text that forms a link. Placed after notification text
       */
      linkText: {
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

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .notification-banner {
    background-color: $lightgrey;
    position: relative;
    z-index: 100;

    p {
      line-height: 1.375rem;

      .icon {
        font-size: 1.25rem;
        margin-right: 0.75rem;
        line-height: 1.5rem;
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
    url="https://www.europeana.eu"
    text="You're viewing the new Europeana experience."
    link-text="Go to Europeana"
    :ignorable="false"
  />
  ```

  With a close button
  ```jsx
  <NotificationBanner
    text="This is a notification about something you should know about the website"
  />
  ```
  </docs>
