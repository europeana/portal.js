<template>
  <div
    data-qa="API requests"
  >
    <b-button
      v-b-modal.api-requests
    >
      API requests
    </b-button>
    <b-modal
      id="api-requests"
      centered
      size="xl"
      title="API requests"
    >
      <ol>
        <li
          v-for="(request, index) of requests"
          :key="index"
        >
          <code>
            {{ request.method }}
            <a
              v-if="request.method === 'GET'"
              target="blank"
              :href="request.uri"
            >
              {{ request.uri }}
            </a>
            <template
              v-else
            >
              {{ request.uri }}
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
    }
  };
</script>
