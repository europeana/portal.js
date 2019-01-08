<template>
  <li class="card">
    <a :href="url">
      <div class="card-wrapper">
        <span class="content-source">{{ contentSource }}</span>
        <h3>{{ cardTitle }}</h3>
        <img :src="imageUrl">
      </div>
    </a>
  </li>
</template>


<script>
export default {
  props: {
    cardTitle: {
      type: String,
      default: 'Content'
    },
    contentSource: {
      type: String,
      default: 'External Link'
    },
    url: {
      type: String,
      default: 'http://www.europeana.eu'
    },
    imageUrl: {
      type: String,
      default: ''
    }
  }
};
</script>

<style>
  .card {
    list-style: none;
    float: left;
    width: 20%;
    margin: 2.5%;
    display: inline-block;
  }
  .card-wrapper{
    display: block;
    width: 100%;
    overflow: hidden;
    height: 25em;
  }
  .content-source {
    text-align: left;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    text-transform: uppercase;
  }
</style>
