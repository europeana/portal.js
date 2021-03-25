<template>
  <figure>
    <figcaption
      v-if="caption"
      class="text-uppercase font-weight-bold"
      data-qa="link group caption"
    >
      {{ caption }}
    </figcaption>
    <ul
      class="m-0 p-0"
      data-qa="link group links"
      :class="listClass"
    >
      <li
        v-for="(link, index) in links"
        :key="index"
      >
        <SmartLink
          v-if="link.url"
          :destination="link.url"
          :link-class="linkClass"
        >
          <template v-if="link.icon">
            <i
              :class="link.icon"
              :title="link.text"
            />
          </template>
          <template v-else>
            {{ link.text }}
          </template>
        </SmartLink>
        <template v-else>
          {{ link.text }}
        </template>
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
        default: ''
      },

      links: {
        type: Array,
        required: true
      },

      linkClass: {
        type: String,
        default: ''
      },

      listClass: {
        type: String,
        default: ''
      }
    }
  };
</script>
