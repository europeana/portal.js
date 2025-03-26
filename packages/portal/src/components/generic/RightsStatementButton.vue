<template>
  <div>
    <SmartLink
      id="rights-statement-button"
      :destination="url ? rightsStatement : null"
      class="rights-statement-button attribution"
      data-qa="rights statement"
      hide-external-icon
    >
      <RightsStatement
        :rights-statement-url="rightsStatement"
      />
    </SmartLink>
    <!-- For better keyboard accessibility render tooltip in container right after rights statement button so the link inside the tooltip gets focus on next tab -->
    <div id="tooltip-container" />
    <b-tooltip
      v-if="$te(`rights.tooltip.${reusability}`)"
      target="rights-statement-button"
      placement="bottom"
      container="tooltip-container"
    >
      <i18n
        :path="`rights.tooltip.${reusability}`"
        tag="span"
      >
        <template #rightsStatementName>
          {{ name }}
        </template>
        <template #readMoreLink>
          <SmartLink
            :destination="rightsStatement"
            class="d-block"
          >
            {{ $t('rights.tooltip.readMore', { link: hostName }) }}
          </SmartLink>
        </template>
      </i18n>
    </b-tooltip>
  </div>
</template>

<script>
  import RightsStatement from '@/components/generic/RightsStatement';
  import SmartLink from '@/components/generic/SmartLink';
  import rightsStatementMixin from '@/mixins/rightsStatement';

  export default {
    components: {
      RightsStatement,
      SmartLink
    },
    mixins: [
      rightsStatementMixin
    ],
    props: {
      rightsStatement: {
        type: String,
        default: ''
      }
    },
    computed: {
      name() {
        return this.rightsNameAndIcon(this.rightsStatement).name;
      },
      reusability() {
        return this.rightsNameAndIcon(this.rightsStatement).reusability;
      },
      url() {
        try {
          const url = new URL(this.rightsStatement);
          return url;
        } catch {
          return null;
        }
      },
      hostName() {
        return this.url?.host;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .rights-statement-button {
    color: $darkgrey;
    background: $offwhite;
    border-radius: 0.25rem;
    padding: 0.38rem 0.625rem;
    font-size: $font-size-small;
    transition: $standard-transition;
    overflow: hidden;
    display: inline-block;

    &:hover {
      cursor: pointer;
      box-shadow: $boxshadow-light;
    }
  }
</style>
