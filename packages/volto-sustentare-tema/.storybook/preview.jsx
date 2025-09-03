// Import the package theme so Storybook loads our global styles and variables
try {
  require('../src/theme/_main.scss');
} catch (e) {
  // best-effort: if SCSS can't be compiled (missing loader), we'll continue silently
}

const React = require('react');
const { StaticRouter } = require('react-router-dom');
const { IntlProvider } = require('react-intl');

exports.parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
};

exports.decorators = [
  (Story) =>
    React.createElement(
      IntlProvider,
      { messages: {}, locale: 'en', defaultLocale: 'en' },
      React.createElement(StaticRouter, { location: '/' }, React.createElement(Story)),
    ),
];
