<template>
  <div>
    <component
      :is="titleTag"
      v-if="title"
      class="group-title text-uppercase font-weight-bold"
      data-qa="link group title"
    >
      {{ title }}
    </component>
    <ul
      class="m-0 p-0"
      data-qa="link group links"
      :class="listClass"
    >
      <li
        v-for="(link, index) in filteredLinks"
        :key="index"
        class="link"
      >
        <SmartLink
          v-if="link.url"
          :destination="link.url"
          :link-class="linkClass"
          :data-qa="link.dataQa"
          :hide-external-icon="link.hideExternalIcon"
        >
          <span
            v-if="link.icon"
            :class="`footer-link-icon ${link.icon}`"
            :title="link.text"
          />
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
       * Optional class for styling of links
       */
      linkClass: {
        type: String,
        default: ''
      },

      /**
       * Optional class for styling of list
       */
      listClass: {
        type: String,
        default: ''
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

<docs lang="md">
  ```jsx
  <LinkGroup
    title="This title is optional"
    :links="[{ url: '/help', text: 'Help' }, { url: '/rights', text: 'Terms of use' }]"
  />
  ```
</docs>
