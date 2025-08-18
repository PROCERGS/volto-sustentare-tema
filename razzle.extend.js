/*
	Minimal runtime alias so app code (and Storybook) can import
	"volto-site-componentes" without changing package.json.
	Conforms to Volto addon extender API (plugins, modify).
*/

const path = require('path');

// Root addon folder is .../packages/volto-sustentare-tema
// Target src is      .../packages/volto-site-componentes/packages/volto-site-componentes/src
const ALIAS_PATH = path.join(
	__dirname,
	'packages',
	'volto-site-componentes',
	'packages',
	'volto-site-componentes',
	'src',
);

function applyAlias(cfg) {
	cfg.resolve = cfg.resolve || {};
	const alias = (cfg.resolve && cfg.resolve.alias) || {};
	cfg.resolve.alias = {
		...alias,
		'volto-site-componentes': ALIAS_PATH,
	};
	return cfg;
}

// Ensure our aliased package gets transpiled by the existing babel-loader
function ensureBabelTranspilesAlias(cfg) {
	const addInclude = (rule) => {
		if (!rule) return false;
		// Detect babel-loader usage in this rule
		const uses = [];
		if (rule.loader && String(rule.loader).includes('babel-loader')) {
			uses.push(rule.loader);
		}
		if (rule.use) {
			const arr = Array.isArray(rule.use) ? rule.use : [rule.use];
			arr.forEach((u) => {
				if (u && u.loader && String(u.loader).includes('babel-loader')) {
					uses.push(u.loader);
				}
			});
		}
		if (uses.length) {
			if (Array.isArray(rule.include)) {
				if (!rule.include.includes(ALIAS_PATH)) {
					rule.include.push(ALIAS_PATH);
				}
			} else if (rule.include) {
				// If include exists but it's not an array, convert to array and append
				rule.include = [rule.include, ALIAS_PATH];
			} else {
				// If no include is present, create one with our path
				rule.include = [ALIAS_PATH];
			}
			return true;
		}
		return false;
	};

	const walk = (rules) => {
		if (!Array.isArray(rules)) return;
		rules.forEach((rule) => {
			if (!rule) return;
			if (rule.oneOf) {
				walk(rule.oneOf);
			} else {
				addInclude(rule);
			}
		});
	};

	if (cfg && cfg.module && Array.isArray(cfg.module.rules)) {
		walk(cfg.module.rules);
	}
	return cfg;
}

module.exports = {
	// Keep default plugins untouched
	plugins: (defaultPlugins) => defaultPlugins,

	// Volto expects `modify` in addon extenders
	modify: (config /* webpack config */, { target, dev } /* env */, webpackConfig) => {
		// Alias first, then ensure Babel includes our alias path
		const cfg = applyAlias(config);
		return ensureBabelTranspilesAlias(cfg);
	},
};
