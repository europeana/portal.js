<template>
  <div>
   <b-link
      v-if="link && src"
      :href="link"
      target="_blank"
    >
      <b-img-lazy
        :src="src"
        class="mw-100"
        alt=""
        data-qa="media preview image"
      />
      <p v-if="pdf">
        {{ $t('record.view.pdf') }}
      </p>
      <p v-else>
        {{ $t('record.view.image') }}
      </p>
    </b-link>
    <b-img-lazy
      v-else-if="!link && src"
      :src="src"
      alt=""
      class="mw-100"
      data-qa="media preview image"
    />
  </div>
</template>

<script>
  export default {
    props: {
      pdf: {
        type: Boolean,
        default: false
      },
      link: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    }
  };
</script>
