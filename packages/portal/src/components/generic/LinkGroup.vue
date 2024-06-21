<template>
  <div :class="`link-group-${variant}`">
    <component
      :is="titleTag"
      v-if="title"
      class="group-title text-uppercase font-weight-bold"
      data-qa="link group title"
    >
      {{ title }}
    </component>
    <ul
      class="link-group-list m-0 p-0"
      data-qa="link group links"
    >
      <li
        v-for="(link, index) in filteredLinks"
        :key="index"
        class="link"
      >
        <SmartLink
          v-if="link.url"
          :destination="link.url"
          :data-qa="link.dataQa"
          :hide-external-icon="link.hideExternalIcon"
        >
          <span
            v-if="link.icon"
            :class="`footer-link-icon ${link.icon}`"
            :title="link.text"
          />
          <img
            v-else-if="link.image"
            :src="link.image"
            :alt="link.text"
          >
          <template v-else>
            {{ link.text }}
          </template>
        </SmartLink>
        <template v-else>
          {{ link.text }}
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
  import SmartLink from './SmartLink';

  export default {
    name: 'LinkGroup',

    components: {
      SmartLink
    },

    props: {
      /**
       * Title of the link group
       */
      title: {
        type: String,
        default: ''
      },
      /**
       * HTML tag element to use for the title
       */
      titleTag: {
        type: String,
        default: 'h3'
      },

      /**
       * Collection of links
       */
      links: {
        type: Array,
        required: true
      },

      /**
       * Variant for specific styles
       * @values light, social, dark
       */
      variant: {
        type: String,
        default: 'light'
      }
    },
    computed: {
      filteredLinks() {
        if (this.links.length === 0) {
          return false;
        }
        return this.links.filter(link => link !== null);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .group-title {
    font-size: $font-size-small;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .link-group-list {
    list-style-type: none;

    li {
      a {
        font-size: $font-size-small;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .link-group-light {
    .group-title {
      color: $bodygrey;
    }

    .link-group-list {
      li {
        a {
          color: $white;
        }
      }
    }
  }
</style>

<docs lang="md">
    Variant "light" (default)
  ```jsx
  <div style="background-color: #000; margin: -16px; padding: 16px;">
    <LinkGroup
      title="This title is optional"
      :links="[{ url: '/help', text: 'Help' }, { url: '/rights', text: 'Terms of use' }]"
    />
  </div>
  ```
  Variant "dark"
  ```jsx
  <LinkGroup
    title="This title is optional"
    :links="[{ url: '/help', text: 'Help' }, { url: '/rights', text: 'Terms of use' }]"
    variant="dark"
  />

  ```
</docs>
