
<template>
  <div class="container">
    <div
      v-if="title || description"
      class="row text-center mb-4 mb-4k-5"
    >
      <h2 v-if="title">
        {{ title }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        class="text mb-3"
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
        class="col"
        :image="person.image"
        :name="person.name"
        :role="person.role"
        :email="person.email"
        :linked-in="
          /^http(s):\/\/www\.linkedin\.com/.test(person.website)
            ? person.website
            : null
        "
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

<docs lang="md">
```jsx
  <PersonSection
    title="Person section"
    description="description with _markup_"
    :people="[person[0],person[0],person[0],person[0],person[0],person[0],person[0]]"
  />
```
</docs>
