<template>
  <b-row
    class="flex-md-row"
    data-qa="blog categories"
  >
    <b-col cols="12">
      <h3 class="font-weight-bold">
        {{ categoryTitle }}
      </h3>
      <ul class="list-unstyled">
        <li
          v-for="(category) in categories"
          :key="category"
        >
          {{ category }}
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'BlogCategories',

    props: {
      categories: {
        type: Array,
        required: true
      }
    },

    computed: {
      categoryTitle() {
        return this.categories.length > 1 ? this.$t('blog.categories') : this.$t('blog.category');
      }
    }
  };
</script>
