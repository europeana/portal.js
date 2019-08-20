<template>
  <b-jumbotron
    :header="headline"
    :lead="description"
    :style="{ 'background-image': 'url(' + heroImage + ')' }"
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
      heroImage: {
        type: String,
        default: ''
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
    }
  };
</script>
