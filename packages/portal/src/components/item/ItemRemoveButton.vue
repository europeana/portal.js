<template>
  <div>
    <b-button
      v-b-tooltip.bottom
      class="remove-button text-uppercase d-inline-flex align-items-center"
      :class="{ 'button-icon-only': !buttonText }"
      :variant="buttonVariant"
      data-qa="item remove button"
      :aria-label="$t('actions.remove')"
      :title="tooltipTitle"
      @click="removeItem"
    >
      <span class="icon-remove-circle-outlined" />
      {{ buttonText ? $t('actions.remove') : '' }}
    </b-button>
  </div>
</template>

<script>
  import { useCardinality } from '@/composables/cardinality.js';
  import useMakeToast from '@/composables/makeToast.js';
  import { langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'ItemRemoveButton',

    props: {
      /**
       * Identifier(s) of the item
       */
      identifiers: {
        type: [String, Array],
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

    setup(props) {
      const { cardinality } = useCardinality(props.identifiers);
      const { makeToast } = useMakeToast();
      return { cardinality, makeToast };
    },

    computed: {
      activeSet() {
        return this.$store.state.set.active;
      },
      selectionCount() {
        return Array.isArray(this.identifiers) ? this.identifiers.length : false;
      },
      tooltipTitle() {
        return this.$tc(`set.actions.removeItems.${this.cardinality}`, this.selectionCount, { count: this.selectionCount });
      },
      toastMessage() {
        const setTitle = langMapValueForLocale(this.activeSet.title, this.$i18n.locale).values[0];
        return this.$tc(`set.notifications.itemsRemoved.${this.cardinality}`, this.selectionCount, { count: this.selectionCount, gallery: setTitle });
      }
    },

    methods: {
      async removeItem() {
        const setId = this.activeSet.id;

        try {
          await this.$apis.set.deleteItems(setId, this.identifiers);
          this.$store.dispatch('set/refreshSet');
          this.makeToast(this.toastMessage);
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
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
