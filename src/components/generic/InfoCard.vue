<template>
  <b-card
    class="text-left content-card"
    data-qa="content card"
    no-body
    :class="cardClass"
  >
    <div
      v-if="imageUrl"
      class="card-img"
    >
      <b-img
        :src="imageUrl"
        @error="imageNotFound"
      />
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
      >
        {{ label }}
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
  export default {
    name: 'InfoCard',

    components: {},

    props: {
      info: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: null
      },
      imageUrl: {
        type: String,
        default: ''
      },
      variant: {
        type: String,
        default: 'default' // other options: dark
      }
    },
    data() {
      return {
        cardImageUrl: this.imageUrl,
        displayLabelTypes: 'exhibitions|galleries|blog|collections'
      };
    },

    computed: {
      cardClass() {
        return `${this.variant}-card`;
      }
    },

    watch: {
      imageUrl() {
        this.cardImageUrl = this.imageUrl;
      }
    },

    methods: {
      imageNotFound() {
        this.cardImageUrl = '';
      }
    }
  };
</script>
