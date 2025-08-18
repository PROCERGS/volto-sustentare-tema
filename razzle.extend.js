/*
	Minimal runtime alias so app code (and Storybook) can import
	"volto-site-componentes" without changing package.json.
	Conforms to Volto addon extender API (plugins, modify).
*/

const path = require('path');
const fs = require('fs');

// Resolve alias target robustly to work both locally and in CI
function resolveAliasBase() {
	const siblingSrc = path.join(
		__dirname,
		'packages',
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
	// Last resort: sibling path (may not exist in CI, but keeps dev working)
	return siblingSrc;
}
const ALIAS_BASE = resolveAliasBase();

// Resolve a specific component file across base directories and extensions
function resolveComponent(relComponentPath) {
	const exts = ['.jsx', '.js', '.tsx', '.ts'];
	const bases = [];
	// If ALIAS_BASE already points to src/dist/lib/root, try that first
	bases.push(ALIAS_BASE);
	// If ALIAS_BASE is not an absolute path (unlikely), skip
	try {
		const pkgRoot = path.dirname(
			require.resolve('volto-site-componentes/package.json', { paths: [__dirname] }),
		);
		bases.push(path.join(pkgRoot, 'src'));
		bases.push(path.join(pkgRoot, 'dist'));
		bases.push(path.join(pkgRoot, 'lib'));
		bases.push(pkgRoot);
	} catch (e) {
		// ignore
	}
	// Also try sibling src explicitly
	bases.push(
		path.join(
			__dirname,
			'packages',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
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

// Pre-resolve the exact deep-import files so we can alias them and include their dirs in Babel
const RESOLVED_BARRA_ESTADO = resolveComponent('components/BarraEstado/BarraEstado');
const RESOLVED_BARRA_ACESS = resolveComponent('components/BarraAcessibilidade/BarraAcessibilidade');

function applyAlias(cfg) {
	cfg.resolve = cfg.resolve || {};
	const alias = (cfg.resolve && cfg.resolve.alias) || {};
	// Base alias for package root (for shallow imports)
	const baseAlias = ALIAS_BASE;
	cfg.resolve.alias = {
		...alias,
		'volto-site-componentes': baseAlias,
		// Map the deep imports directly to concrete files if resolvable
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
			const includesToAdd = [ALIAS_BASE].filter(Boolean);
			// Also include component directories (not files) so HMR/transpile works
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
	// Keep default plugins untouched
	plugins: (defaultPlugins) => defaultPlugins,

	// Volto expects `modify` in addon extenders
	modify: (config /* webpack config */, { target, dev } /* env */, webpackConfig) => {
		// Alias first, then ensure Babel includes our alias path
		const cfg = applyAlias(config);
		return ensureBabelTranspilesAlias(cfg);
	},
};
