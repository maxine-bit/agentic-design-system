// Style Dictionary config — Phase 1 will populate this fully.
// Runs one build per theme, outputting CSS variables + a JS/TS module.

const themes = ['green', 'blue', 'purple'];

export default {
  source: [
    'tokens/primitives/**/*.json',
    // Theme-specific semantic layer is injected per-theme in platforms below
  ],
  platforms: Object.fromEntries(
    themes.map((theme) => [
      theme,
      {
        transformGroup: 'css',
        prefix: `ads`, // agentic design system
        buildPath: `dist/${theme}/`,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            options: { selector: `[data-theme="${theme}"]` },
          },
          {
            destination: 'tokens.js',
            format: 'javascript/es6',
          },
        ],
      },
    ])
  ),
};
