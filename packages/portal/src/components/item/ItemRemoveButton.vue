<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="remove-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      data-qa="item remove button"
      :aria-label="$t('actions.remove')"
      :title="$t('account.tooltip.remove')"
      @click="removeItem"
    >
      <span class="icon-remove-circle-outlined" />
      {{ buttonText ? $t('actions.remove') : '' }}
    </b-button>
  </div>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'ItemRemoveButton',

    mixins: [
      makeToastMixin
    ],

    props: {
      /**
       * Identifier of the item
       */
      identifier: {
        type: String,
        required: true
      },
      /**
       * Button variant to use for styling the buttons
       */
      buttonVariant: {
        type: String,
        default: 'outline-light'
      },
      /**
       * If `true`, button text will be rendered
       */
      buttonText: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      async removeItem() {
        const activeSet = this.$store.state.set.active;
        const setId = activeSet.id;
        const setTitle = langMapValueForLocale(activeSet.title, this.$i18n.locale).values[0];
        await this.$apis.set.modifyItems('delete', setId, this.identifier);
        this.$store.dispatch('set/refreshSet');
        this.makeToast(this.$t('set.notifications.itemRemoved', { gallery: setTitle }));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .remove-button:hover {
    .icon-remove-circle-outlined::before {
      content: '\e917';
    }
  }
</style>
