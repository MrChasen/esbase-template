const path = require('path');
const renderTemplate = require('../utils/renderTemplate');

module.exports = async function create(appPath, options) {
  const {
    needsEslint, needsToolkit, needsRouter, needsTypeScript, needsStylelint, ts,
  } = options;
  const templateRoot = path.resolve(__dirname, '../', 'template');
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, appPath);
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
};
