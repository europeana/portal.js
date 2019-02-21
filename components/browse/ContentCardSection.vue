<template>
  <div>
    <div
      v-for="section in page.hasPart"
      :key="section.sys.id"
      class="banner"
    >
      <h2>{{ section.fields.headline }}</h2>
      <p>{{ section.fields.text }}</p>

      <b-card-group deck>
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
  </div>
</template>

<script>
  import { ContentCard } from '~/components/generic';

  export default {
    components: {
      ContentCard
    },
    props: {
      page: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
