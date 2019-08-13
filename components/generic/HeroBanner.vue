<template>
  <b-jumbotron
    :header="headline"
    :lead="description"
    :style="{ 'background-image': 'url(' + heroImage + ')' }"
    fluid
    header-tag="h2"
    header-level="4"
    text-variant="white"
  >
    <b-link
      :to="localePath({ name: 'record-all', params: { pathMatch: identifier }})"
      class="attribution"
    >
      {{ attribution }}
      <span>{{ rights }}</span>
    </b-link>
  </b-jumbotron>
</template>

<script>
  export default {
    props: {
      heroImage: {
        type: String,
        default: 'https://proxy.europeana.eu/90402/SK_A_1709?api_url=https%3A%2F%2Fapi.europeana.eu%2Fapi'
      },
      headline: {
        type: String,
        default: 'Unique Selling Point 1. Limit of two lines'
      },
      description: {
        type: String,
        default: 'Can be a static image stating briefly all the Unique Selling Points of Europeana or a caroussel with 3/4 highlighted USP’s. Limit of 3 lines.'
      },
      identifier: {
        type: String,
        default: '90402/SK_A_1709'
      },
      attribution: {
        type: String,
        default: 'The Lake of Zurich, 1660, Jan Hackaert, Rijksmuseum'
      },
      rights: {
        type: String,
        default: 'Public Domain'
      }
    }
  };
</script>
