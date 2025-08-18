/*
	Volto addon extender for the inner package.
	- Keeps default plugins (plugins passthrough)
	- Adds a webpack alias for 'volto-site-componentes' so runtime resolves to the local src
*/

const path = require('path');
const fs = require('fs');

// Resolve alias target robustly to work both locally and in CI
function resolveAliasBase() {
	const siblingSrc = path.join(
		__dirname,
		'..',
		'volto-site-componentes',
		'packages',
		'volto-site-componentes',
		'src',
	);
	const exists = (p) => p && fs.existsSync(p);

	if (exists(siblingSrc)) return siblingSrc;

	try {
		const pkgRoot = path.dirname(
			require.resolve('volto-site-componentes/package.json', { paths: [__dirname] }),
		);
		const candidates = [
			path.join(pkgRoot, 'src'),
			path.join(pkgRoot, 'dist'),
			path.join(pkgRoot, 'lib'),
			pkgRoot,
		];
		const found = candidates.find((c) => exists(c));
		if (found) return found;
	} catch (e) {
		// ignore
	}

	return siblingSrc;
}
const ALIAS_BASE = resolveAliasBase();

function resolveComponent(relComponentPath) {
	const exts = ['.jsx', '.js', '.tsx', '.ts'];
	const bases = [];
	bases.push(ALIAS_BASE);
	try {
		const pkgRoot = path.dirname(
			require.resolve('volto-site-componentes/package.json', { paths: [__dirname] }),
		);
		bases.push(path.join(pkgRoot, 'src'));
		bases.push(path.join(pkgRoot, 'dist'));
		bases.push(path.join(pkgRoot, 'lib'));
		bases.push(pkgRoot);
	} catch (e) {}
	bases.push(
		path.join(__dirname, '..', 'volto-site-componentes', 'packages', 'volto-site-componentes', 'src'),
	);
	for (const base of bases) {
		if (!base || !fs.existsSync(base)) continue;
		for (const ext of exts) {
			const abs = path.join(base, relComponentPath) + ext;
			if (fs.existsSync(abs)) return abs;
		}
	}
	return null;
}

const RESOLVED_BARRA_ESTADO = resolveComponent('components/BarraEstado/BarraEstado');
const RESOLVED_BARRA_ACESS = resolveComponent('components/BarraAcessibilidade/BarraAcessibilidade');

function applyAlias(cfg) {
	cfg.resolve = cfg.resolve || {};
	const alias = (cfg.resolve && cfg.resolve.alias) || {};
	const baseAlias = ALIAS_BASE;
	cfg.resolve.alias = {
		...alias,
		'volto-site-componentes': baseAlias,
		...(RESOLVED_BARRA_ESTADO
			? {
					'volto-site-componentes/components/BarraEstado/BarraEstado': RESOLVED_BARRA_ESTADO,
			  }
			: {}),
		...(RESOLVED_BARRA_ACESS
			? {
					'volto-site-componentes/components/BarraAcessibilidade/BarraAcessibilidade':
						RESOLVED_BARRA_ACESS,
			  }
			: {}),
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
			const includesToAdd = [ALIAS_BASE].filter(Boolean);
			const compDirs = [RESOLVED_BARRA_ESTADO, RESOLVED_BARRA_ACESS]
				.filter(Boolean)
				.map((f) => path.dirname(f));
			if (Array.isArray(rule.include)) {
				includesToAdd.forEach((p) => {
					if (!rule.include.includes(p)) rule.include.push(p);
				});
				compDirs.forEach((d) => {
					if (!rule.include.includes(d)) rule.include.push(d);
				});
			} else if (rule.include) {
				rule.include = [rule.include, ...includesToAdd, ...compDirs];
			} else {
				rule.include = [...includesToAdd, ...compDirs];
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

