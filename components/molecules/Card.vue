<template>
  <div class="card">
    <LoadingImage
      :thumbnail="thumbnail"
      :url="url" />
    <BrowseCardText
      :url="url"
      :link-text="linkText"
      :texts="texts" />
  </div>
</template>

<script>
import BrowseCardText from './BrowseCardText';
import LoadingImage from '../atoms/LoadingImage';

export default{
  components: {
    LoadingImage, BrowseCardText
  },
  props: {
    thumbnail: {
      type: String,
      default: ''
    },
    linkText: {
      type: String,
      default: ''
    },
    texts: {
      type: Array,
      default(){ }
    },
    url: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
  .card{
    display:        flex;
    flex-direction: column;
    font-size:      0.75em;
    height:         100%;
    line-height:    1.1875rem;
    transition:     box-shadow 0.25s;
  }
</style>
