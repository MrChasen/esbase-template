module.exports = {
  serverPort: 9527,
  copyFile: [
    './config.js',
  ],
  html: [
    {
      name: 'index',
      title: 'React Project',
      entry: './src/index.jsx',
      template: 'template/index.html',
    },
  ],
};
