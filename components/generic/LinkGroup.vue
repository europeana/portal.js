<template>
  <figure>
    <figcaption
      class="text-uppercase font-weight-bold"
      data-qa="footer caption"
    >
      {{ caption }}
    </figcaption>
    <ul
      class="footer-link-list m-0 p-0"
      data-qa="footer links"
    >
      <li
        v-for="(footerLink, index) in links"
        :key="index"
      >
        <SmartLink
          v-if="footerLink.url"
          :destination="footerLink.url"
          link-class="footer-link"
        >
          {{ footerLink.text }}
        </SmartLink>
        <p v-else>
          {{ footerLink.text }}
        </p>
      </li>
    </ul>
  </figure>
</template>

<script>
  import SmartLink from './SmartLink';

  export default {
    name: 'LinkGroup',

    components: {
      SmartLink
    },

    props: {
      caption: {
        type: String,
        required: true
      },

      links: {
        type: Array,
        required: true
      }
    }
  };
</script>
