// Build script — runs Style Dictionary for each theme.
// Replaces CLI usage because SD's CLI doesn't support array config exports.
// Run with: node scripts/build.js  (or npm run build)

import StyleDictionary from 'style-dictionary';

const themes = ['green', 'blue', 'purple'];

for (const theme of themes) {
  const sd = new StyleDictionary({
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
  });

  await sd.buildAllPlatforms();
}
