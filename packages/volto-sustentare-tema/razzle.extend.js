/*
	Volto addon extender for the inner package.
	- Keeps default plugins (plugins passthrough)
	- Adds a webpack alias for 'volto-site-componentes' so runtime resolves to the local src
*/

const path = require('path');

// Inner package lives in: .../packages/volto-sustentare-tema
// Sibling package is at:  .../packages/volto-site-componentes/packages/volto-site-componentes/src
const ALIAS_PATH = path.join(
	__dirname,
	'..',
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

function ensureBabelTranspilesAlias(cfg) {
	const addInclude = (rule) => {
		if (!rule) return false;
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
				rule.include = [rule.include, ALIAS_PATH];
			} else {
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
	plugins: (defaultPlugins) => defaultPlugins,
	modify: (config /* webpack config */, { target, dev } /* env */) => {
		const cfg = applyAlias(config);
		return ensureBabelTranspilesAlias(cfg);
	},
};

