<template>
  <span
    :id="id"
    class="d-inline-flex"
    @mouseleave="hideTooltips"
    @click="$refs.debiasButton.focus()"
  >
    <dfn>
      <slot>{{ term }}</slot>
    </dfn><!-- This comment removes white space
    --><b-button
      ref="debiasButton"
      variant="light-flat"
      class="p-0"
      @blur="hideTooltips"
    >
      <span class="icon-debias" />
      <span class="visually-hidden">
        {{ $t('record.explanationby', [$t('record.debias')]) }}
      </span>
    </b-button>
    <span :id="tooltipId" />
    <b-tooltip
      :target="id"
      :container="tooltipId"
      :boundary="'viewport'"
      :triggers="'hover focus click'"
    >
      {{ definition }}
      <i18n
        path="record.explanationby"
        tag="cite"
        class="d-block text-right mx-0 mt-3"
      >
        <SmartLink
          :destination="linkDestination"
          hide-external-icon
        >
          <span class="icon-debias-logo ml-1" />
          <span class="visually-hidden">
            {{ $t('record.debias') }}
          </span>
        </SmartLink>
      </i18n>
    </b-tooltip>
  </span>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemDebiasTerm',

    components: {
      SmartLink
    },

    props: {
      id: {
        type: String,
        default: 'item-debias-term'
      },
      tooltipId: {
        type: String,
        default: 'item-debias-term-tooltip'
      },
      term: {
        type: String,
        default: null
      },
      definition: {
        type: String,
        default: null
      },
      deBiasId: {
        type: String,
        default: null
      }
    },

    setup(props) {
      const { hideTooltips } = useHideTooltips(props.id);
      return { hideTooltips };
    },

    computed: {
      linkDestination() {
        if (this.deBiasId) {
          const uri = new URL(this.deBiasId);
          const num = uri.pathname.split('/').pop().split('.').shift().split('_')[1];

          const pathMatch = `${num}-${this.term.toLowerCase()}`;

          return {
            name: 'debias-all',
            params: {
              pathMatch
            }
          };
        } else {
          return 'https://pro.europeana.eu/project/de-bias';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  dfn {
    border-bottom: 2px dotted $darkgrey-light;
    margin-bottom: -2px;
    font-style: normal;
  }

  .btn-light-flat {
    line-height: 1;
    color: $darkgrey-light;

    .icon-debias {
      font-size: $font-size-xl;
      line-height: 1rem;
    }
  }

  ::v-deep .tooltip.b-tooltip .tooltip-inner {
    max-width: 250px;
    text-align: left;

    @media (min-width: $bp-small) {
      max-width: 380px;
    }

    @media (min-width: $bp-medium) {
      padding: 1rem;
    }
  }

  .icon-debias-logo {
    font-size: $font-size-medium;
  }
</style>

<docs lang="md">
  ```jsx
  <p>
    Some text before
    <ItemDebiasTerm
    term="debias term"
    definition="This text is the definition of the debias term"
    />
    and some text after
  </p>
  ```
</docs>
