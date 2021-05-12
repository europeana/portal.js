import axios from 'axios';

const encodedAuthString = Buffer.from(`${process.env.JIRA_API_USER}:${process.env.JIRA_API_TOKEN}`).toString('base64');

export default {
  path: '/jira-servicedesk',
  handler(req, res) {
    if (req.method === 'POST') {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      }).on('end', () => {
        let parsedData = (JSON.parse(data));
        const createRequestData = {
          serviceDeskId: '7',
          requestTypeId: '81', // Type 81 is 'suggestion'
          requestFieldValues: {
            summary: parsedData.summary
          }
        };
        if (parsedData.email) {
          createRequestData.raiseOnBehalfOf = parsedData.email;
        }

        axios.post('https://europeana.atlassian.net/rest/servicedeskapi/request', createRequestData, {
          headers: {
            'Authorization': `Basic ${encodedAuthString}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(response => {
          res.end(response.statusText);
        }).catch((error) => {
          if (error.response) {
            res.statusCode = error.response.status;
            res.end(error.response.data.message);
          } else {
            res.statusCode = 500;
            res.end(error);
          }
        });
      }).on('error', (err) => {
        res.statusCode = 500;
        res.end(err);
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  }
};
