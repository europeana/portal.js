<template>
  <div
    class="banner"
    data-qa="browse section"
  >
    <h2 data-qa="section headline">{{ section.fields.headline }}</h2>
    <p>{{ section.fields.text }}</p>

    <b-card-group
      deck
      data-qa="section group"
    >
      <ContentCard
        v-for="card in section.fields.hasPart"
        :key="card.sys.id"
        :name="card.fields.name"
        :description="card.fields.description"
        :url="card.fields.url"
        :image-url="card.fields.image.fields.file.url"
        :image-title="card.fields.image.fields.title"
      />
    </b-card-group>
  </div>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

  export default {
    components: {
      ContentCard
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
