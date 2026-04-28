// Style Dictionary config — one build per theme.
// Each theme gets its own source set: primitives + shared semantic base + theme-specific brand colours.
// This ensures {color.fg.brand} resolves to the right hex per theme without any manual overrides.

const themes = ['green', 'blue', 'purple'];

export default themes.map((theme) => ({
  source: [
    'tokens/primitives/**/*.json',
    'tokens/semantic/base.json',
    `tokens/semantic/themes/${theme}.json`,
    'tokens/component/**/*.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ads',
      buildPath: `dist/${theme}/`,
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: `[data-theme="${theme}"]` },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      prefix: 'ads',
      buildPath: `dist/${theme}/`,
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
}));
