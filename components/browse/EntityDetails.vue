<template>
  <b-row>
    <b-col
      v-if="depictionThumbnail && attribution"
      cols="12"
      sm="4"
    >
      <b-link
        :href="attribution"
        :title="$t('entityDepictionCredit')"
        class="depiction mb-3 d-block overflow-hidden rounded-circle position-relative"
        target="_blank"
        data-qa="entity attribution"
      >
        <b-img
          :src="depictionThumbnail"
          fluid
          :alt="$t('depiction', { title: title })"
          data-qa="entity depiction"
          @error="depictionNotFound"
        />
      </b-link>
    </b-col>
    <b-col>
      <h1 data-qa="entity title">
        {{ title }}
      </h1>
      <p
        v-if="description"
        data-qa="entity description"
      >
        {{ showAll ? description : truncatedDescription }}
        <br>
        <b-link
          v-if="description.length > limitCharacters"
          data-qa="entity show link"
          @click="toggleMoreDescription"
        >
          {{ showAll ? $t('showLess') : $t('showMore') }}
        </b-link>
      </p>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      depiction: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        depictionThumbnail: this.depiction,
        limitCharacters: 200,
        showAll: false
      };
    },
    computed: {
      truncatedDescription() {
        if (!this.description) {
          return;
        }
        return this.description.length > this.limitCharacters ? this.description.slice(0, this.limitCharacters) + '...' : this.description;
      }
    },
    methods: {
      depictionNotFound() {
        // clear depictionThumbnail and attribution to prevent showing a broken image and
        // contextless link
        this.depictionThumbnail = '';
        this.attribution = '';
      },
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .depiction {
    box-shadow: $boxshadow-small;
    padding-top: 100%;
    width: 100%;

    img {
      bottom: 0;
      height: 100%;
      left: 0;
      object-fit: cover;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
    }
  }

  .attribution {
    font-size: $font-size-extrasmall;
  }
</style>
