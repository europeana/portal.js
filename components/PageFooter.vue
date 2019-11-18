<template>
  <footer
    data-qa="footer"
    class="p-3"
  >
    <b-container>
      <b-row>
        <b-col
          cols="12"
          lg="9"
        >
          <ul
            v-if="links"
            class="footer-link-list m-0 p-0"
          >
            <li
              v-for="(footerLink, index) in links"
              :key="index"
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
        </b-col>
        <b-col
          cols="12"
          lg="3"
        >
          <LangSelector
            data-qa="language selector"
          />
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import LangSelector from './generic/LanguageSelector';

  export default {
    components: {
      SmartLink,
      LangSelector
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
