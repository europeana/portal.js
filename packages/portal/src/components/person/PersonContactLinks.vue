<template>
  <div>
    <SmartLink
      v-if="email"
      :destination="`mailto:${email}`"
    >
      <span class="icon-email" />
      {{ email }}
    </SmartLink>
    <SmartLink
      v-if="linkedInProfile"
      :destination="linkedInProfile"
      :hide-external-icon="true"
    >
      <span class="icon-linkedin" />
      LinkedIn
    </SmartLink>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'PersonContactLinks',

    components: {
      SmartLink
    },

    props: {
      email: {
        type: String,
        default: null
      },
      website: {
        type: String,
        default: null
      }
    },

    computed: {
      linkedInProfile() {
        return this.isLinkedInUrl(this.website) ? this.website : undefined;
      }
    },

    methods: {
      isLinkedInUrl(url) {
        return /^http(s):\/\/www\.linkedin\.com/.test(url);
      }
    }
  };
</script>
