<template>
  <b-jumbotron
    :header="headline"
    :lead="description"
    :style="jumbotronStyle"
    fluid
    header-tag="h2"
    header-level="4"
    text-variant="white"
    data-qa="hero banner"
  >
    <b-link
      :to="localePath({ name: 'record-all', params: { pathMatch: identifier.slice(1) }})"
      class="attribution"
    >
      {{ attribution }}
      <RightsStatement
        :rights-statement-url="rightsStatement"
      />
    </b-link>
  </b-jumbotron>
</template>

<script>

  import RightsStatement from '../../components/generic/RightsStatement';

  export default {
    components: {
      RightsStatement
    },
    props: {
      imageUrl: {
        type: String,
        default: ''
      },
      imageContentType: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      identifier: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
      },
      rightsStatement: {
        type: String,
        default: ''
      }
    },
    computed: {
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType);
      },
      jumbotronStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      }
    }
  };
</script>
