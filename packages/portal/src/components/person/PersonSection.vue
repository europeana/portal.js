
<template>
  <div class="container">
    <div
      v-if="title || description"
      class="row mx-auto mb-4 mb-4k-5"
    >
      <component
        :is="titleTag"
        v-if="title"
        class="title mx-auto col-12"
      >
        {{ title }}
      </component>
      <!-- eslint-disable vue/no-v-html -->
      <p
        v-if="description"
        class="text col-12 mb-3 mx-auto"
        v-html="parseMarkdown(description)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div
      class="row justify-content-center mt-4 mt-4k-5 g-4 g-4k-5 row-cols-1 row-cols-md-2 row-cols-lg-4"
    >
      <PersonCard
        v-for="(person, index) in people"
        :id="`person-${index}`"
        :key="index"
        class="col mb-5"
        :image="person.image"
        :name="person.name"
        :role="person.role"
        :email="person.email"
        :website="person.website"
        :lazy="true"
      />
    </div>
  </div>
</template>
<script>
  import PersonCard from '@/components/person/PersonCard';
  import parseMarkdown from '@/utils/markdown/parse.js';

  export default {
    components: {
      PersonCard
    },
    props: {
      /**
       * Title for display as heading
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      },
      /**
       * Description, displays under title.
       * Supports markdown.
       */
      description: {
        type: String,
        default: null
      },
      /**
       * List of person entries
       */
      people: {
        type: Array,
        required: true
      }
    },

    methods: {
      parseMarkdown
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  .text, .title {
    text-align: center;
  }
</style>

<docs lang="md">
```jsx
  <PersonSection
    title="Person section"
    description="Description with _markup_."
    :people="[people[0],people[0],people[0],people[0],people[0],people[0],people[0]]"
  />
```
```jsx
  <PersonSection
    title="With h4 title override"
    titleTag="h4"
    description="Description with _markup_. This one also has a whole lot of __extra__ text. All of which results in the entire description taking up much more room and ultimately wrapping onto *__multiple lines__* on devices which are otherwise unable to fit the entire text onto a single line. This helps demonstrate what longer multi-line descriptions will look like."
    :people="[people[0],people[0],people[0],people[0],people[0],people[0],people[0]]"
  />
</docs>
