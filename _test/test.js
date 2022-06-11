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

  let result = {};
  try {
    result = await prompts(
      [
        {
          name: 'needsTypeScript',
          type: () => (ts ? null : 'toggle'),
          message: 'Add TypeScript?',
          initial: false,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsRouter',
          type: 'toggle',
          message: 'Add React Router for Single Page Application development?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsToolkit',
          type: 'toggle',
          message: 'Add React Toolkit for Single Page Application development?',
          initial: true,
          active: 'Yes',
          inactive: 'No',
        },
        {
          name: 'needsStylelint',
          type: 'toggle',
          message: 'Add Stylelint for code quality?',
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

      ],
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  console.log(result, '<___result');
  console.log(ts, '<___ts');
  const {
    needsEslint, needsToolkit, needsRouter, needsTypeScript,
  } = result;
  const templateRoot = path.resolve(__dirname, '../', 'template');
  console.log(templateRoot, '<___templateRoot');
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, root);
  };
  render('base');
  render('scripts/zip');
  if (ts || needsTypeScript) {
    render('tsconfig');
    render('babel/babel-tsx');
    render('webpack/webpack-tsx');
    if (needsEslint) {
      render('eslint/eslint-tsx');
    }
    if (needsRouter || needsToolkit) {
      if (needsRouter && needsToolkit) {
        render('code/typescript-toolkit-router');
        render('entryConfig/typescript-toolkit-router');
      } else if (needsRouter) {
        render('code/typescript-router');
        render('entryConfig/typescript-router');
      } else if (needsToolkit) {
        render('code/typescript-toolkit');
        render('entryConfig/typescript-toolkit');
      }
    } else {
      render('code/typescript-default');
    }
  } else {
    render('babel/babel-jsx');
    render('webpack/webpack-jsx');
    if (needsEslint) {
      render('eslint/eslint-tsx');
    }
    if (needsRouter || needsToolkit) {
      if (needsRouter && needsToolkit) {
        render('code/toolkit-router');
        render('entryConfig/toolkit-router');
      } else if (needsRouter) {
        render('code/router');
        render('entryConfig/router');
      } else if (needsToolkit) {
        render('code/toolkit');
        render('entryConfig/toolkit');
      }
    } else {
      render('code/default');
    }
  }
}

test().catch((err) => {
  console.log(err);
});
