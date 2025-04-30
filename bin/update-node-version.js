import fs from 'fs';

const FILE_PATHS = {
  dockerfiles: [
    '../packages/portal/Dockerfile',
    '../styleguide/Dockerfile',
    '../packages/portal/tests/size/Dockerfile'
  ],
  githubWorkflows: [
    '../.github/workflows/ci.yml',
    '../.github/workflows/lokalise.yml',
    '../.github/workflows/npm.yml'
  ],
  nvmRc: '../.nvmrc',
  packageManifest: '../package.json',
  packageLock: '../package-lock.json',
  readme: '../README.md'
};

const getVersion = () => {
  let version = process.argv[2];
  if (!version) {
    throw('No version specified')
  }

  version = Number(version);
  if (!Number.isInteger(version)) {
    throw(`Invalid integer version number: ${version}`);
  }

  console.log(`Node version: ${version}`);

  return version.toString();
};

const replaceVersionInFile = (filePaths, patternOrGenerator, replacement) => {
  let generateNewContent;
  let pattern;
  if (typeof patternOrGenerator === 'function') {
    generateNewContent = patternOrGenerator;
  } else {
    pattern = patternOrGenerator;
    generateNewContent = (oldContent) => oldContent.replace(pattern, replacement);
  }

  for (const filePath of [].concat(filePaths)) {
    const url = new URL(filePath, import.meta.url);
    console.log(`Updating Node version in ${url}`);

    let fileContent = fs.readFileSync(url, { encoding: 'utf8' });

    fs.writeFileSync(url, generateNewContent(fileContent));
  }
};

const updateNvmRc = (version) => {
  replaceVersionInFile(FILE_PATHS.nvmRc, /^[0-9]+$/, version);
};

const updateDockerfiles = (version) => {
  replaceVersionInFile(FILE_PATHS.dockerfiles, /ARG node_version=[0-9]+/g, `ARG node_version=${version}`);
};

const updateGithubWorkflows = (version) => {
  replaceVersionInFile(FILE_PATHS.githubWorkflows, /node-version: [0-9]+/g, `node-version: ${version}`);
};

const updateReadme = (version) => {
  replaceVersionInFile(FILE_PATHS.readme, /Node.js version [0-9]+/g, `Node.js version ${version}`);
};

const updatePackageManifest = (version) => {
  replaceVersionInFile(FILE_PATHS.packageManifest, (oldContent) => {
    const json = JSON.parse(oldContent);

    json.engines.node = `^${version}`;

    return JSON.stringify(json, null, 2);
  });
};

const updatePackageLock = (version) => {
  replaceVersionInFile(FILE_PATHS.packageLock, (oldContent) => {
    const json = JSON.parse(oldContent);

    json.packages[''].engines.node = `^${version}`;

    return JSON.stringify(json, null, 2);
  });
};

const updateNodeVersion = () => {
  const version = getVersion();

  updateNvmRc(version);
  updateDockerfiles(version);
  updateGithubWorkflows(version);
  updatePackageManifest(version);
  updatePackageLock(version);
  updateReadme(version);
};

try {
  updateNodeVersion();
} catch (error) {
  console.error(`Error: ${error}`);
  console.log();
  console.log(`Usage: node update-node-version.js NODE_VERSION`);
  process.exit(1);
}
