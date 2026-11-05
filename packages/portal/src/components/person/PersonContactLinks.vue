<template>
  <div>
    <SmartLink
      v-if="email"
      :destination="`mailto:${email}`"
      class="email-link text-decoration-none"
    >
      <span class="icon-email mr-1" />
      {{ email }}
    </SmartLink>
    <SmartLink
      v-if="linkedInProfile"
      :destination="linkedInProfile"
      :hide-external-icon="true"
      class="linkedin-link text-decoration-none"
    >
      <span class="icon-linkedin-circle mr-1" />
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
