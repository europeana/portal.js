<template>
  <footer
    data-qa="footer"
    class="footer"
  >
    <b-container>
      <ul
        v-if="footerLinks"
        class="footer-link-list"
      >
        <li
          v-for="footerLink in footerLinks"
          :key="footerLink.url"
        >
          <b-link
            v-if="footerLink.url"
            :href="footerLink.url"
            class="footer-link"
          >
            {{ footerLink.text }}
          </b-link>
          <p v-else>
            {{ footerLink.text }}
          </p>
        </li>
      </ul>
    </b-container>
  </footer>
</template>

<script>
  import contentfulClient from '../plugins/contentful.js';

  export default {
    data () {
      return {
        footerLinks: []
      };
    },
    async created () {
      this.footerLinks = await this.getFooterLinks();
    },
    methods: {
      getFooterLinks () {
        let links = contentfulClient.getEntries({
          'content_type': 'linkGroup',
          'fields.identifier': 'footer',
          'limit': 1
        })
          .then((response) => {
            if (response.total == 0) {
              return [];
            }
            return response.items[0].fields.links.map(item => {
              return item.fields;
            });
          }).catch((e) => {
            // This will just output the error as text
            return [{ text: e.toString() }];
          });
        return links;
      }
    }
  };
</script>

<style lang="scss">
  @import '../assets/scss/variables.scss';

  footer {
    background-color: $darkblue;
    color: #fff;
  }
</style>
