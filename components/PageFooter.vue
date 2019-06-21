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
            <b-link
              v-if="footerLink.url.startsWith('/')"
              :to="footerLink.url"
              class="footer-link"
            >
              {{ footerLink.text }}
            </b-link>
            <b-link
              v-else
              :href="footerLink.url"
              class="footer-link"
            >
              {{ footerLink.text }}
            </b-link>
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
  export default {
    computed: {
      links () {
        return this.$store.state.footer.links;
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
