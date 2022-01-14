<template>
  <span
    data-qa="rights statement"
    class="d-inline-flex align-items-center"
  >
    <span
      v-if="replaceIcon"
      :class="replaceIcon"
    />
    <template v-else>
      <span
        v-for="icon in rightsNameAndIcon(rightsStatementUrl).iconClass"
        :key="icon"
        :class="icon"
        class="license"
      />
    </template>
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
      replaceIcon: {
        type: String,
        default: null
      }
    }
  };
</script>
