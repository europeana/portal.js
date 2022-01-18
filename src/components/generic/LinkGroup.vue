<template>
  <div>
    <div
      v-if="caption"
      class="group-title text-uppercase font-weight-bold"
      data-qa="link group caption"
    >
      {{ caption }}
    </div>
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
       * Caption of the link group
       */
      caption: {
        type: String,
        default: ''
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
  Variant without caption
  ```jsx
  <LinkGroup
    :links="[{ 'url': '/help', 'text': 'Help' }, { 'url': '/rights', 'text': 'Terms of use' }]"
    linkClass="footer-link"
    listClass="footer-link-list"
  />
  ```

  Variant with caption
  ```jsx
  <LinkGroup
    caption="This is a link group"
    :links="[{ 'url': '/help', 'text': 'Help' }, { 'url': '/rights', 'text': 'Terms of use' }]"
    linkClass="footer-link"
    listClass="footer-link-list"
  />
  ```
</docs>
