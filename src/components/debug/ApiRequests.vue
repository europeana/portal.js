<template>
  <div
    data-qa="API requests"
  >
    <b-button
      v-b-modal.api-requests
      variant="light"
      data-qa="API requests modal button"
    >
      {{ title }}
    </b-button>
    <b-modal
      id="api-requests"
      size="xl"
      :title="title"
      hide-footer
      data-qa="API requests modal"
    >
      <ol
        v-if="requests.length > 0"
      >
        <li
          v-for="(request, index) of requests"
          :key="index"
          data-qa="logged API request"
        >
          <code>
            {{ request.method }}
            <a
              v-if="request.method === 'GET'"
              target="_blank"
              :href="request.url"
            >
              {{ request.url }}
            </a>
            <template
              v-else
            >
              {{ request.url }}
            </template>
          </code>
        </li>
      </ol>
    </b-modal>
  </div>
</template>

<script>
  export default {
    props: {
      requests: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        title: this.$t('debug.apiRequests')
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  .modal {
    &#api-requests {
      font-family: $font-family-sans-serif;
      .modal-title {
        font-size: 1.5rem;
        font-weight: 600;
      }
      ol {
        list-style: none;
        counter-reset: item;
        padding-left: 0;
      }
      li {
        counter-increment: item;
        margin-bottom: 10px;
        line-height: 1.2;
        padding-left: 2rem;
      }
      li:before {
        content: counter(item);
        margin-left: -2rem;
        background: #e83e8c;
        border-radius: 100%;
        color: white;
        width: 1.2rem;
        text-align: center;
        display: inline-block;
      }
    }
  }
</style>
