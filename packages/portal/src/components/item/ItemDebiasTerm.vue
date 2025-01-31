<template>
  <span id="debias widget">
    <dfn>{{ term }}</dfn>
    <b-button>icon needs SR text</b-button>
    <span id="tooltip-container" />
    <b-tooltip
      target="debias widget"
      container="tooltip-container"
    >
      {{ definition }}
      <i18n
        path="record.explanationby"
        tag="span"
      >
        <SmartLink
          :destination="linkToDebiasProjectPage"
          hide-external-icon
        >
          {{ $t('record.debias') }}
        </SmartLink>
      </i18n>
    </b-tooltip>
  </span>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'ItemDebiasTerm',

    components: {
      SmartLink
    },

    props: {
      term: {
        type: String,
        default: null
      },
      definition: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        linkToDebiasProjectPage: 'https://pro.europeana.eu/project/de-bias'
      };
    }
  };
</script>

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
