
<template>
  <div class="person-section">
    <div
      v-if="title || description"
      class="section-header mx-auto"
    >
      <component
        :is="titleTag"
        v-if="title"
        class="title mx-auto col-12"
      >
        {{ title }}
      </component>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        class="text col-12 mx-auto pb-lg-3"
        v-html="parseMarkdown(description)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div
      class="row justify-content-center row-cols-2 row-cols-md-3 row-cols-lg-5"
    >
      <PersonCard
        v-for="(person, index) in people"
        :key="index"
        class="person-card col"
        :image="person.image"
        :name="person.name"
        :role="person.title"
        :email="person.email"
        :website="person.url"
        :show-contact-buttons="showContactButtons"
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
      },
      /**
       * Show or hide person contact buttons
       */
      showContactButtons: {
        type: Boolean,
        default: true
      }
    },

    methods: {
      parseMarkdown
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .person-section {
    --bp-4k-increment: 1.5;
  }

  .text,
  .title {
    text-align: center;
    max-width: $max-text-column-width;

    @media (min-width: $bp-4k) {
      max-width: $max-text-column-width-landing-4k;
    }
  }

  ::v-deep .row-cols-lg-5 > * {
    @media (min-width: $bp-xxxl) {
      flex-basis: 16.667%;
      max-width: 16.667%;
    }
  }

  .section-header {
    margin-bottom: 1.5rem;

    @media (min-width: $bp-large) {
      margin-bottom: 3rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: calc(var(--bp-4k-increment) * 3rem);
    }
  }

  .person-card {
    margin-bottom: 1.5rem;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(var(--bp-4k-increment) * 1.5rem);
    }
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
```
```jsx
  <PersonSection
    title="Without contact buttons"
    titleTag="h4"
    description="Description with _markup_."
    :showContactButtons="false"
    :people="[people[0],people[0],people[0],people[0],people[0],people[0],people[0]]"
  />
```
</docs>
