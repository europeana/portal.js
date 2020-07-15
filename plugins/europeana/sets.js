import { config } from './';

const setsApiUrl = `${config.set.origin}${config.set.path}`;

export default $axios => ({

  createLikes() {
    return $axios.post(setsApiUrl,
      {
        title: {
          en: 'LIKES'
        }
      }

    )
      .then((response) => {
        return response;
      });
  },

  addToSet(likesId, itemId) {
    const params = likesId + '/' + itemId;
    return $axios.put(setsApiUrl + params)
      .then((response) => {
        return response.data;
      });
  },

  deleteFromSet(likesId, itemId) {
    const params = likesId + '/' + itemId;
    return $axios.delete(setsApiUrl + params)
      .then((response) => {
        return response.data;
      });
  }

});

