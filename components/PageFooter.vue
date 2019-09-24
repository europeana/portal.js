<template>
  <footer
    data-qa="footer"
    class="footer"
  >
    <b-container>
      <ul
        v-if="links"
        class="footer-link-list"
      >
        <li
          v-for="footerLink in links"
          :key="footerLink.url"
        >
          <template
            v-if="footerLink.url"
          >
            <SmartLink
              :destination="footerLink.url"
              link-class="footer-link"
            >
              {{ footerLink.text }}
            </SmartLink>
          </template>
          <p v-else>
            {{ footerLink.text }}
          </p>
        </li>
      </ul>
    </b-container>
  </footer>
</template>

<script>
  import SmartLink from './generic/SmartLink';

  export default {
    components: {
      SmartLink
    },
    computed: {
      links() {
        return this.$store.state['link-group'].links.footer;
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
