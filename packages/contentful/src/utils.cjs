const chalk = require('chalk');
const inquirer = require('inquirer');
const logUpdate = require('log-update');

const purgeContentEntry = async(entry, { makeRequest }) => {
  const id = entry.sys.id;

  if (entry.sys.publishedAt) {
    logUpdate('Unpublishing', id);
    await makeRequest({
      method: 'DELETE',
      url: `/entries/${id}/published`
    });
  }

  logUpdate('Deleting', id);
  await makeRequest({
    method: 'DELETE',
    url: `/entries/${id}`
  });
};

const purgeContentType = async(contentType, migration, { makeRequest, environmentId }) => {
  console.log(chalk.bold.green('The following task has been planned'));
  console.log();
  console.log(chalk.bold(`Environment: ${chalk.yellow(environmentId)}`));
  console.log();
  console.log(chalk.bold(`Unpublish and delete all entries of content type: ${chalk.yellow(contentType)}`));
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'purge',
      message: 'Do you want to run the task?',
      default: false
    }
  ]);

  if (!answer.purge) {
    console.log('Exiting. Nothing has been deleted.');
    process.exit(1);
  }

  let noMoreItems = false;
  let limit = 100;
  while (!noMoreItems) {
    const response = await makeRequest({
      method: 'GET',
      url: '/entries',
      params: {
        'content_type': contentType,
        limit
      }
    });

    if (response.items.length > 0) {
      for (const entry of response.items) {
        await purgeContentEntry(entry, { makeRequest });
      }
    } else {
      noMoreItems = true;
    }
  }

  logUpdate.clear();
  console.log();

  migration.deleteContentType(contentType);
};

module.exports = {
  purgeContentType
};
