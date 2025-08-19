/*
	Minimal runtime alias so app code (and Storybook) can import
	"volto-site-componentes" without changing package.json.
	Conforms to Volto addon extender API (plugins, modify).
*/

const path = require('path');
const fs = require('fs');

// Resolve alias target robustly to work both locally and in CI
function resolveAliasBase() {
	const candidatesLocal = [
		// Nested copy under this addon
		path.join(
			__dirname,
			'packages',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
		// Top-level sibling under frontend/packages
		path.join(
			__dirname,
			'..',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
	];
	const exists = (p) => p && fs.existsSync(p);
	const localFound = candidatesLocal.find((p) => exists(p));
	if (localFound) return localFound;
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
	// Last resort: first local candidate (even if missing)
	return candidatesLocal[0];
}
const ALIAS_BASE = resolveAliasBase();

// Resolve the entry index file for the package (so that `import 'volto-site-componentes'`
// gets proper named exports detection in webpack)
function resolveIndexFile() {
	const bases = [];
	if (ALIAS_BASE) bases.push(ALIAS_BASE);
	try {
		const pkgRoot = path.dirname(
			require.resolve('volto-site-componentes/package.json', { paths: [__dirname] }),
		);
		bases.push(path.join(pkgRoot, 'src'));
		bases.push(path.join(pkgRoot, 'dist'));
		bases.push(path.join(pkgRoot, 'lib'));
		bases.push(pkgRoot);
	} catch (e) {}
	const exts = ['.js', '.jsx', '.ts', '.tsx'];
	for (const base of bases) {
		if (!base) continue;
		for (const ext of exts) {
			const candidate = path.join(base, 'index' + ext);
			if (fs.existsSync(candidate)) return candidate;
		}
	}
	return null;
}
const ALIAS_INDEX_FILE = resolveIndexFile();

// Resolve a specific component file across base directories and extensions
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
		// nested under addon
		path.join(
			__dirname,
			'packages',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
		// top-level sibling
		path.join(
			__dirname,
			'..',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
	);

	const resolveCaseInsensitive = (base, parts) => {
		let cur = base;
		for (const part of parts) {
			if (!fs.existsSync(cur) || !fs.statSync(cur).isDirectory()) return null;
			const entries = fs.readdirSync(cur);
			const match = entries.find((e) => e.toLowerCase() === part.toLowerCase());
			if (!match) return null;
			cur = path.join(cur, match);
		}
		return cur;
	};

	const parts = relComponentPath.split('/');
	for (const base of bases) {
		if (!base || !fs.existsSync(base)) continue;
		const withoutExt = resolveCaseInsensitive(base, parts);
		if (!withoutExt) continue;
		for (const ext of exts) {
			const abs = withoutExt + ext;
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
	// Map bare specifier to a concrete index file if possible for correct export detection
	...(ALIAS_INDEX_FILE ? { 'volto-site-componentes$': ALIAS_INDEX_FILE } : {}),
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

// Ensure .less files under the aliased package are processed (some plugins ship .less in src)
function ensureLessIncludesAlias(cfg) {
	if (!ALIAS_BASE) return cfg;
	const addInclude = (rule) => {
		const hasLess =
			(rule.test && String(rule.test).includes('less')) ||
			(rule.use && JSON.stringify(rule.use).includes('less-loader')) ||
			(rule.loader && String(rule.loader).includes('less-loader'));
		if (!hasLess) return;
		if (Array.isArray(rule.include)) {
			if (!rule.include.includes(ALIAS_BASE)) rule.include.push(ALIAS_BASE);
		} else if (rule.include) {
			rule.include = [rule.include, ALIAS_BASE];
		} else {
			rule.include = [ALIAS_BASE];
		}
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

// As a fallback, inject a dedicated LESS rule for our alias base to cover cases where
// the core plugin's LESS rule is added after our includes update.
function ensureLessRuleForAlias(cfg, { target, dev }) {
	if (!ALIAS_BASE) return cfg;
	cfg.module = cfg.module || {};
	cfg.module.rules = cfg.module.rules || [];
	const isServer = target !== 'web';

	// Avoid duplicating if a rule already specifically includes our base
	const alreadyHandled = cfg.module.rules.some((rule) => {
		if (!rule || !rule.test) return false;
		const isLess = String(rule.test).includes('less');
		const include = rule.include;
		const includesBase = Array.isArray(include)
			? include.includes(ALIAS_BASE)
			: include === ALIAS_BASE;
		return isLess && includesBase;
	});
	if (alreadyHandled) return cfg;

	const lessRule = {
		test: /\.less$/,
		include: [ALIAS_BASE],
		use: isServer
			? [
					{
						loader: require.resolve('css-loader'),
						options: {
							sourceMap: true,
							importLoaders: 1,
							modules: { auto: true, exportOnlyLocals: true },
						},
					},
					{ loader: require.resolve('less-loader'), options: { sourceMap: true } },
				]
			: [
					{ loader: require.resolve('style-loader') },
					{
						loader: require.resolve('css-loader'),
						options: { sourceMap: !!dev, importLoaders: 1, modules: { auto: true } },
					},
					{ loader: require.resolve('less-loader'), options: { sourceMap: true } },
				],
	};
	cfg.module.rules.push(lessRule);
	return cfg;
}

module.exports = {
	// Keep default plugins untouched
	plugins: (defaultPlugins) => defaultPlugins,

	// Volto expects `modify` in addon extenders
	modify: (config /* webpack config */, { target, dev } /* env */, webpackConfig) => {
		// Alias first, then ensure Babel includes our alias path
	let cfg = applyAlias(config);
	cfg = ensureBabelTranspilesAlias(cfg);
	cfg = ensureLessIncludesAlias(cfg);
	cfg = ensureLessRuleForAlias(cfg, { target, dev });
		return cfg;
	},
};
