module.exports = {
  banner:
    '/*!\n' +
    ` * el-css-var ${require('./package.json').version}\n` +
    ` * (c) 2024-present\n` +
    ' */\n',

  aliasConfig: {
    '@': 'src',
  },

  outputDir: 'lib',

  formats: [
    {
      format: 'es',
      inputFiles: ['**/*'],
      outputDir: 'lib/es',
      outputFile: '[name][ext]',
    },
    {
      format: 'cjs',
      inputFiles: ['**/*'],
      outputDir: 'lib/cjs',
      outputFile: '[name][ext]',
    },
  ],

  typesOutputDir: 'types',

  node: true,
};
