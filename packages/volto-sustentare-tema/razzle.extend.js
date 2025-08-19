/*
	Volto addon extender for the inner package.
	- Keeps default plugins (plugins passthrough)
	- Adds a webpack alias for 'volto-site-componentes' so runtime resolves to the local src
*/

const path = require('path');
const fs = require('fs');

// Resolve alias target robustly to work both locally and in CI
function resolveAliasBase() {
	const candidatesLocal = [
		// nested sibling from inner package
		path.join(
			__dirname,
			'..',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
		// top-level sibling under frontend/packages
		path.join(
			__dirname,
			'..',
			'..',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
		// Local shim (for CI environments where the package isn't present)
		path.join(__dirname, '..', 'shims', 'volto-site-componentes'),
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

	return candidatesLocal[0];
}
const SHIM_PATH = path.join(__dirname, '..', 'shims', 'volto-site-componentes');
let ALIAS_BASE = resolveAliasBase();
if (!ALIAS_BASE || !fs.existsSync(ALIAS_BASE)) {
	ALIAS_BASE = SHIM_PATH;
}

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
let ALIAS_INDEX_FILE = resolveIndexFile();
if (!ALIAS_INDEX_FILE && fs.existsSync(path.join(ALIAS_BASE, 'index.js'))) {
	ALIAS_INDEX_FILE = path.join(ALIAS_BASE, 'index.js');
}

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
		// nested sibling
		path.join(__dirname, '..', 'volto-site-componentes', 'packages', 'volto-site-componentes', 'src'),
		// top-level sibling under frontend/packages
		path.join(
			__dirname,
			'..',
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

const RESOLVED_BARRA_ESTADO = resolveComponent('components/BarraEstado/BarraEstado');
const RESOLVED_BARRA_ACESS = resolveComponent('components/BarraAcessibilidade/BarraAcessibilidade');

function applyAlias(cfg) {
	cfg.resolve = cfg.resolve || {};
	const alias = (cfg.resolve && cfg.resolve.alias) || {};
	const baseAlias = ALIAS_BASE;
	cfg.resolve.alias = {
		...alias,
		...(ALIAS_INDEX_FILE ? { 'volto-site-componentes$': ALIAS_INDEX_FILE } : {}),
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

function ensureLessRuleForAlias(cfg, { target, dev }) {
	if (!ALIAS_BASE) return cfg;
	cfg.module = cfg.module || {};
	cfg.module.rules = cfg.module.rules || [];
	const isServer = target !== 'web';

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
	plugins: (defaultPlugins) => defaultPlugins,
	modify: (config /* webpack config */, { target, dev } /* env */) => {
	let cfg = applyAlias(config);
	cfg = ensureBabelTranspilesAlias(cfg);
	cfg = ensureLessIncludesAlias(cfg);
	cfg = ensureLessRuleForAlias(cfg, { target, dev });
		return cfg;
	},
};

