<template>
  <span
    data-qa="rights statement"
    class="license-label d-inline-flex align-items-center"
    :class="{ 'text-uppercase': variant === 'simple' }"
  >
    <template v-if="variant === 'icons'">
      <span
        v-for="icon in rightsNameAndIcon(rightsStatementUrl).iconClass"
        :key="icon"
        :class="icon"
        class="license"
      />
    </template>
    <span
      v-else
      class="icon-license"
    />
    <span class="license-label-text">
      {{ rightsNameAndIcon(rightsStatementUrl).name }}
    </span>
  </span>
</template>

<script>
  import { rightsNameAndIcon } from '@/utils/europeana/rightsStatement';

  export default {
    props: {
      rightsStatementUrl: {
        type: String,
        required: true
      },
      /**
       * Style variant to use
       * @values icons, simple
       */
      variant: {
        type: String,
        default: 'icons'
      }
    },

    methods: {
      rightsNameAndIcon
    }
  };
</script>
