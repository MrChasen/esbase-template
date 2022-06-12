const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');
const prompts = require('prompts');
const renderTemplate = require('../utils/renderTemplate');

async function test() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ['ts'],
    },
  });

  const { ts } = argv;
  const targetDir = argv._[0];
  const root = path.resolve(__dirname, targetDir);
  console.log(root);

  if (fs.pathExistsSync(root)) {
    fs.removeSync(root);
  } else {
    fs.mkdirsSync(root);
  }

  const packageJson = {
    name: targetDir,
    version: '0.0.1',
  };
  const packageJsonPath = path.join(root, 'package.json');
  fs.outputFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  let result = {};
  try {
    result = await prompts(
      [
        {
          name: 'needsTypeScript',
          type: () => (ts ? null : 'toggle'),
          message: 'Add TypeScript?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsRouter',
          type: 'toggle',
          message: 'Add React Router for Application development?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsToolkit',
          type: 'toggle',
          message: 'Add React Toolkit for Application development?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsEslint',
          type: 'toggle',
          message: 'Add ESLint for code quality?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsStylelint',
          type: 'toggle',
          message: 'Add Stylelint for Scss code quality?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
      ],
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  const {
    needsEslint, needsToolkit, needsRouter, needsTypeScript, needsStylelint,
  } = result;
  const templateRoot = path.resolve(__dirname, '../', 'template');
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, root);
  };
  const codeType = (ts || needsTypeScript) ? 'typescript-' : '';
  const fileIndex = (ts || needsTypeScript) ? 'tsx' : 'jsx';
  render('base');
  render('scripts/zip');
  render(`babel/babel-${fileIndex}`);
  render(`webpack/webpack-${fileIndex}`);

  if (needsToolkit || needsRouter) {
    if (needsToolkit && needsRouter) {
      render(`code/${codeType}toolkit-router`);
      render(`entryConfig/${codeType}toolkit-router`);
    } else if (needsRouter) {
      render(`code/${codeType}router`);
      render(`entryConfig/${codeType}router`);
    } else if (needsToolkit) {
      render(`code/${codeType}toolkit`);
      render(`entryConfig/${codeType}toolkit`);
    } else {
      render(`code/${codeType}default`);
    }
  }

  if (ts || needsTypeScript) {
    render('tsconfig');
  }

  if (needsEslint) {
    render(`eslint/eslint-${fileIndex}`);
  }

  if (needsStylelint) {
    render('stylelint/stylelint-scss');
  }
}

test().catch((err) => {
  console.log(err);
});
