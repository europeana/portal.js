<template>
  <b-card
    class="text-center info-card"
    data-qa="info card"
    no-body
    :class="cardClass"
  >
    <SmartLink
      :destination="url"
      link-class="card-link"
    >
      <div
        v-if="image"
        class="card-img"
      >
        <span :class="image" />
      </div>
      <b-card-body data-qa="card body">
        <b-card-title
          v-if="info"
          title-tag="div"
          data-qa="card info"
        >
          <span>
            {{ info }}
          </span>
        </b-card-title>
        <b-card-text
          text-tag="div"
          class="text-uppercase"
        >
          {{ label }}
        </b-card-text>
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  import SmartLink from './SmartLink';
  export default {
    name: 'InfoCard',

    components: {
      SmartLink
    },

    props: {
      url: {
        type: Object,
        default: null
      },
      info: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: null
      },
      image: {
        type: String,
        default: ''
      },
      variant: {
        type: String,
        default: 'default' // other options: dark
      }
    },

    computed: {
      cardClass() {
        return `${this.variant}-card`;
      }
    }
  };
</script>

<docs lang="md">
  Variant "default":
  ```jsx
  <InfoCard
    url="https://www.europeana.eu/en/search?query=&qf=TYPE%3A%22IMAGE%22"
    info="29,734,524"
    label="image"
    image="ic-image"
  />
  ```

  Variant "dark":
  ```jsx
  <InfoCard
    url="https://www.europeana.eu/en/search?query=&qf=TYPE%3A%22IMAGE%22"
    info="29,734,524"
    label="image"
    image="ic-image"
    variant="dark"
  />
  ```
</docs>
