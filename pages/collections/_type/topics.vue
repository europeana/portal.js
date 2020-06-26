<template>
  <b-container>
    <ContentHeader
      :title="$tc('subjects.title', 2)"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="gallery foyer"
        >
          <ContentCard
            v-for="topic in topics"
            :key="topic.id"
            :title="topic.prefLabel[$i18n.locale]"
            :url="topic.id"
            :image-url="topic.isShownBy.thumbnail"
            variant="mini"
          />
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNav
          v-if="showPagination"
          v-model="page"
          :limit="perPage"
          :total-results="total"
          :per-page="perPage"
          :link-gen="paginationLink"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '../../../components/generic/ContentHeader';
  import ContentCard from '../../../components/generic/ContentCard';
  // import { pageFromQuery } from '../../../plugins/utils';

  const PER_PAGE = 24;

  export default {
    name: 'CollectionTopicsPage',
    components: {
      ContentHeader,
      ContentCard,
      PaginationNav: () => import('../../../components/generic/PaginationNav')
    },
    head() {
      return {
        title: this.$tc('subjects.title', 2)
      };
    },
    data() {
      return {
        perPage: PER_PAGE,
        page: null,
        topics: [
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/409',
            prefLabel: {
              en: 'surf music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Fshi-tones2009-02-12.flac16%2Fshi-tones2009-02-12-d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1330',
            prefLabel: {
              en: 'tango'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fkokoelmat.fng.fi%2Fapp%3Fprofile%3Dtopicartworkbignew%26iid%3DX0165200%26action%3Dimage&type=IMAGE'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1538',
            prefLabel: {
              en: 'Cajun music'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Ftb2010-12-05.milab.flac16%2Fbenoit2010-12-05d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          },
          {
            id: 'http://data.europeana.eu/concept/base/1646',
            prefLabel: {
              en: 'blues'
            },
            isShownBy: {
              thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Farchive.org%2Fdownload%2Flovemoney2007-07-22.sbd.early.firstshow%2Flovemoney2007-07-22d1t01.mp3&type=SOUND'
            },
            note: {
              en: [
                'music genre'
              ]
            }
          }
        ]
      };
    },
    computed: {
      showPagination() {
        return this.total > this.perPage;
      }
    },
    // asyncData({ query, redirect, error, app }) {
    //   const currentPage = pageFromQuery(query.page);
    //   if (currentPage === null) {
    //     // Redirect non-positive integer values for `page` to `page=1`
    //     query.page = '1';
    //     return redirect(app.$path({ name: 'collections/topics', query }));
    //   }

    //   const variables = {
    //     locale: app.i18n.isoLocale(),
    //     preview: query.mode === 'preview',
    //     limit: PER_PAGE,
    //     skip: (currentPage - 1) * PER_PAGE
    //   };

    //   return app.$contentful.query('CollectionTopicsPage', variables)
    //     .then(response => response.data.data)
    //     .then(data => {
    //       return {
    //         topics: data.imageGalleryCollection.items,
    //         total: data.imageGalleryCollection.total,
    //         page: currentPage,
    //         perPage: PER_PAGE
    //       };
    //     })
    //     .catch((e) => {
    //       error({ statusCode: 500, message: e.toString() });
    //     });
    // },
    methods: {
      paginationLink(val) {
        return this.$path({ name: 'collections/topics', query: { page: val } });
      },
      imageUrl(data) {
        return (data.encoding ? data.encoding.edmPreview : data.thumbnailUrl) + '&size=w200';
      }
    },
    watchQuery: ['page']
  };
</script>
