module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '61',
          firefox: '60',
          safari: '11',
          edge: '16',
        },
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false,
        // Ensure all modern syntax is transpiled
        bugfixes: false,
        // Force transpilation of these features
        include: [
          'transform-arrow-functions',
          'transform-template-literals',
          'transform-spread',
          'transform-destructuring',
          'transform-parameters',
          'transform-async-to-generator',
          'transform-regenerator',
        ],
      },
    ],
  ],
  plugins: [
    // Ensure async/await is properly transpiled
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-regenerator',
  ],
};