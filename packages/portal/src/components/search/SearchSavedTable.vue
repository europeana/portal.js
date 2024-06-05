<template>
  <ul>
    <li
      v-for="(set, index) in sets"
      :key="index"
    >
      <pre>
        {{ set }}
      </pre>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'SearchSavedTable',

    data() {
      return {
        sets: [],
        total: 0
      }
    },

    async fetch() {
      const qf = [
        'type:Collection',
        'visibility:private'
      ];

      const searchParams = {
        query: `creator:${this.userId}`,
        profile: 'standard',
        pageSize: 100,
        qf
      };

      const searchResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      this.sets = (searchResponse.items || [])
        .filter((set) => set.isDefinedBy);
      this.total = searchResponse.partOf?.total || 0;
    },

    computed: {
      userId() {
        return this.$auth?.user?.sub;
      }
    }
  };
</script>
