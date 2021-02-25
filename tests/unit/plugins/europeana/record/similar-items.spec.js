import similarItemsQuery from '../../../../../plugins/europeana/record/similar-items';

describe('plugins/europeana/record/similar-items', () => {
  const about = '/12345/abcde';

  it('fields on `what` for dcType, boosted by 0.8', () => {
    const data = {
      dcType: ['Type']
    };

    similarItemsQuery(about, data).should.include('what:("Type")^0.8');
  });

  it('fields on `what` for dcSubject, boosted by 0.8', () => {
    const data = {
      dcSubject: ['Subject']
    };

    similarItemsQuery(about, data).should.include('what:("Subject")^0.8');
  });

  it('fields on `who` for dcCreator, boosted by 0.5', () => {
    const data = {
      dcCreator: ['Creator']
    };

    similarItemsQuery(about, data).should.include('who:("Creator")^0.5');
  });

  it('fields on `DATA_PROVIDER` for edmDataProvider, boosted by 0.2', () => {
    const data = {
      edmDataProvider: ['Data Provider']
    };

    similarItemsQuery(about, data).should.include('DATA_PROVIDER:("Data Provider")^0.2');
  });

  it('excludes the current item by `europeana_id`', () => {
    const data = {
      dcType: ['Type']
    };

    similarItemsQuery(about, data).should.include(' NOT europeana_id:"/12345/abcde"');
  });

  it('escapes Lucene special characters in each term', () => {
    const data = {
      dcType: ['http://www.example.org/vocabulary/term']
    };

    similarItemsQuery(about, data).should.include('"http\\:\\/\\/www.example.org\\/vocabulary\\/term"');
  });

  it('combines each term per-field with OR', () => {
    const data = {
      dcSubject: ['Subject1'],
      dcType: ['Type1', 'Type2']
    };

    similarItemsQuery(about, data).should.include('("Subject1" OR "Type1" OR "Type2")');
  });

  it('combines all fielded terms with OR', () => {
    const data = {
      dcCreator: ['Creator'],
      dcType: ['Type']
    };

    similarItemsQuery(about, data).should.include('(what:("Type")^0.8 OR who:("Creator")^0.5)');
  });

  it('omits empty fields', () => {
    const data = {
      dcCreator: [],
      dcType: ['Type']
    };

    similarItemsQuery(about, data).should.not.include('who:(');
  });

  it('handles no relevant query terms sensibly', () => {
    const data = {};

    (similarItemsQuery(about, data) === null).should.be.true;
  });
});
