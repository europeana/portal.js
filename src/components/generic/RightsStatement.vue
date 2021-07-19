<template>
  <span data-qa="rights statement">
    <span
      v-for="icon in rightsNameAndIcon(rightsStatementUrl).iconClass"
      :key="icon"
      :class="icon"
      class="license"
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
      }
    }
  };
</script>
