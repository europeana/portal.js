<template>
  <b-row class="flex-md-row border-top pt-3">
    <b-col
      v-if="tags.length > 0"
      cols="6"
      data-qa="blog tags"
    >
      <strong>Tags:</strong>
      <ul>
        <li
          v-for="(tag, index) in tags"
          :key="index"
        >
          <!-- We will need URLS for the tags -->
          <a
            href="#"
            class="badge badge-secondary"
          >
            {{ tag }}
          </a>
        </li>
      </ul>
    </b-col>
    <b-col
      cols="6"
      data-qa="blog share"
    >
      <strong>Share:</strong>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'TagAndsHARE',

    props: {
      tags: {
        type: Array,
        default: null
      }
    }
  };
</script>
