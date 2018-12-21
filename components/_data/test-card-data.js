const randomYear = function() {
  const y1 = 1800 + Math.floor(Math.random() * Math.floor(100));
  const y2 = 1800 + Math.floor(Math.random() * Math.floor(100));

  return y2 > y1 ? y1 + ' - ' + y2 : y2 + ' - ' + y1
}

let cardData = [];

[...Array(16).keys()].forEach((i)=>{
  let cd       = {}
  cd.id        = i + '';
  cd.linkText  = '(' + (i + 1) + ') The card link text - the card link text - the card link text - the card link text - the card link text - the card link text - the card link text - the card link text - the card link text';
  cd.thumbnail = '/img/storybook/card-img-' + (i + 1) + '.jpg';
  cd.url       = '/cards/' + (i + 1);
  cd.texts     = [randomYear()]
  cardData.push(cd)
})
export default cardData;
