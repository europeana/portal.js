<template>
  <div
    class="page text-page"
    data-qa="debias term page"
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <template v-else>
      <AuthoredHead
        :title="title"
      />
      <b-container
        class="footer-margin"
      >
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8"
          >
            <article v-if="term">
              <p
                v-for="(definition, index) of term.definition?.[$i18n.locale]"
                :key="`definition-${index}`"
              >
                {{ definition }}
              </p>
              <h2 v-if="term.note?.[$i18n.locale]">
                {{ $t('debias.headings.source') }}
              </h2>
              <p
                v-for="(note, index) of term.note?.[$i18n.locale]"
                :key="`note-${index}`"
              >
                {{ note }}
              </p>
              <h2 v-if="term.scopeNote?.[$i18n.locale]">
                {{ $t('debias.headings.recommendations') }}
              </h2>
              <p
                v-for="(scopeNote, index) of term.scopeNote?.[$i18n.locale]"
                :key="`scopeNote-${index}`"
              >
                {{ scopeNote }}
              </p>
              <hr>
              <aside>
                <i18n
                  path="debias.background.text"
                  tag="p"
                >
                  <template #link>
                    <a href="https://pro.europeana.eu/project/de-bias">{{ $t('debias.background.link') }}</a>
                  </template>
                </i18n>
              </aside>
            </article>
            <p v-else>
              {{ $t('debias.termNotFound') }}
            </p>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'DeBiasPage',
    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner')
    },
    mixins: [
      pageMetaMixin
    ],
    data() {
      return {
        term: null
      };
    },
    async fetch() {
      try {
        const annotations = await this.$apis.annotation.search({
          query: `body_uri:"${this.id}"`,
          pageSize: 1,
          profile: 'dereference'
        });

        this.term = annotations?.[0]?.body || null;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },
    computed: {
      id() {
        const idNum = this.$route.params.pathMatch.split('-').shift();

        return `https://rnd-2.eanadev.org/share/debias/vocabulary/c_${idNum}_${this.$i18n.locale}.xml`;
      },

      title() {
        return this.term?.prefLabel[this.$i18n.locale] || this.$i18n.t('messages.notFound');
      },

      pageMeta() {
        return {
          title: this.title,
          // description: ???,
          ogType: 'article'
        };
      }
    }
  };
</script>
