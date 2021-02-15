module.exports = (api) => {
  api.cache(true);
  const presets = [['@babel/preset-env', { targets: { node: 'current' } }]];
  const plugins = [
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ];
  return { plugins, presets };
};
