<template>
  <li class="card">
    <a :href="url">
      <div class="card-wrapper">
        <h2>{{ contentSource }}</h2>
        <h2>{{ cardTitle }}</h2>
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
      default: ''
    },
    contentSource: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
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
</style>
