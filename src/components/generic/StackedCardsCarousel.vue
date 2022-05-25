<template>
  <div>
    <carousel-3d
      perspective="0"
      display="12"
      width="200"
      border="0"
      inverse-scaling="77"
      space="100"
    >
      <slide
        v-for="(slide, i) in slides"
        :key="i"
        :index="i"
      >
        <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
          <b-card
            :data-index="index"
            :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }"
            class="h-100 text-center"
            body-class="d-flex flex-column align-items-center"
          >
            <b-card-title
              v-if="slide.name"
              title-tag="h3"
            >
              <span>
                {{ slide.name }}
              </span>
            </b-card-title>
            <b-card-text
              text-tag="div"
            >
              <p>
                {{ slide.description }}
              </p>
            </b-card-text>
            <b-button
              variant="outline-primary"
              :href="slide.url"
              class="slide-link"
            >
              explore
            </b-button>
          </b-card>
        </template>
      </slide>
    </carousel-3d>
    <carousel-3d
      class="carousel"
      perspective="0"
      display="12"
      width="200"
      border="0"
      inverse-scaling="77"
      space="120"
    >
      <slide
        v-for="(slide, i) in slides"
        :key="i"
        :index="i"
      >
        <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
          <b-card
            :data-index="index"
            :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }"
            class="h-100 text-center"
            body-class="d-flex flex-column align-items-center"
          >
            <b-card-title
              v-if="slide.name"
              title-tag="h3"
            >
              <span>
                {{ slide.name }}
              </span>
            </b-card-title>
            <b-card-text
              text-tag="div"
            >
              <p>
                {{ slide.description }}
              </p>
            </b-card-text>
            <b-button
              variant="outline-primary"
              :href="slide.url"
              class="slide-link"
            >
              explore
            </b-button>
          </b-card>
        </template>
      </slide>
    </carousel-3d>
    <carousel-3d
      perspective="0"
      display="12"
      width="200"
      border="0"
      inverse-scaling="77"
      space="100"
      controls-visible="true"
    >
      <slide
        v-for="(slide, i) in slides"
        :key="i"
        :index="i"
      >
        <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
          <b-card
            :data-index="index"
            :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }"
            class="h-100 text-center"
            body-class="d-flex flex-column align-items-center"
          >
            <b-card-title
              v-if="slide.name"
              title-tag="h3"
            >
              <span>
                {{ slide.name }}
              </span>
            </b-card-title>
            <b-card-text
              text-tag="div"
            >
              <p>
                {{ slide.description }}
              </p>
            </b-card-text>
            <b-button
              variant="outline-primary"
              :href="slide.url"
              class="slide-link"
            >
              explore
            </b-button>
          </b-card>
        </template>
      </slide>
    </carousel-3d>
  </div>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';

  export default {
    name: 'IndexPage',

    components: {
      Carousel3d,
      Slide
    },

    props: {
      slides: {
        type: Array,
        required: true
      }
    },

    mounted() {
      console.log(this.slides);
    }
  };
</script>

<style lang="scss" scoped>
.slide-link {
  margin: auto 0 0 0;
}
</style>
