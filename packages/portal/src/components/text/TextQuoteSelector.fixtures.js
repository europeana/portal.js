export const propsData = {
  multipleMatchingSelectors: {
    selector: [
      {
        prefix: 'is a ',
        exact: 'sentence',
        suffix: ' with'
      },
      {
        exact: 'This',
        suffix: ' is a'
      },
      {
        prefix: 'words to ',
        exact: 'select'
      }
    ],
    text: 'This is a sentence with multiple words to select'
  },

  nonMatchingSelector: {
    selector: {
      exact: 'nowhere'
    },
    text: 'This is a sentence'
  },

  singleMatchingSelector: {
    selector: {
      prefix: 'a sentence ',
      exact: 'with',
      suffix: ' one word'
    },
    text: 'This is a sentence with one word to select'
  }
};
