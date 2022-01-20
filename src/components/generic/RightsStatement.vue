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
    {{ rightsNameAndIcon(rightsStatementUrl).name }}
  </span>
</template>

<script>
  import rightsStatement from '../../mixins/rightsStatement';

  export default {
    mixins: [
      rightsStatement
    ],
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
    }
  };
</script>
