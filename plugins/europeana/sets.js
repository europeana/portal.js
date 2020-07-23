import { config } from './';

const setsApiUrl = `${config.set.origin}${config.set.path}`;

export default $axios => ({

  createLikes() {
    return $axios.post(setsApiUrl + '/',
      {
        title: {
          en: 'LIKES'
        }
      }

    )
      .then((response) => {
        return response.data;
      });
  },

  modifyItems(modify, likesId, itemId) {
    const params =  likesId + '/' + itemId;
    const apicall = modify === 'add' ? $axios.put : $axios.delete;
    return apicall(setsApiUrl + '/' + params)
      .then((response) => {
        return response.data;
      });
  }

});

