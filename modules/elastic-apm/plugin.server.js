import options from './options';
import apm from 'elastic-apm-node';

export default ({ req, res }) => {
  if (!apm.isStarted) apm.start(options);

  const transactionName = `${req.method} ${req.url}`;
  const transaction = apm.startTransaction(transactionName);

  res.on('finish', () => {
    transaction.end();
  });
};
