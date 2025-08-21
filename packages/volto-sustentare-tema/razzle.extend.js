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
		// Prefer top-level sibling under frontend/packages
		path.join(
			__dirname,
			'..',
			'..',
			'volto-site-componentes',
			'packages',
			'volto-site-componentes',
			'src',
		),
		// Fallback: nested sibling from inner package
		path.join(
			__dirname,
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
// Try both likely shim locations (inner and outer package layouts)
const SHIM_CANDIDATES = [
	path.join(__dirname, '..', '..', 'shims', 'volto-site-componentes'),
	path.join(__dirname, '..', 'shims', 'volto-site-componentes'),
];
const SHIM_PATH = SHIM_CANDIDATES.find((p) => fs.existsSync(p));
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
if (!ALIAS_INDEX_FILE && ALIAS_BASE && fs.existsSync(path.join(ALIAS_BASE, 'index.js'))) {
	ALIAS_INDEX_FILE = path.join(ALIAS_BASE, 'index.js');
}

// Removed deep-import pre-resolution: rely on proper directory aliases and standard resolution

function getSubdir(dirName) {
	if (!ALIAS_BASE) return null;
	try {
		const baseName = path.basename(ALIAS_BASE);
		if (baseName.toLowerCase() === dirName.toLowerCase()) return ALIAS_BASE;
		const candidate = path.join(ALIAS_BASE, dirName);
		if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
	} catch (e) {}
	return null;
}
const SRC_DIR = getSubdir('src');
const SRC_INDEX = SRC_DIR
	? ['.js', '.jsx', '.ts', '.tsx']
			.map((ext) => path.join(SRC_DIR, 'index' + ext))
			.find((p) => fs.existsSync(p))
	: null;

function applyAlias(cfg) {
	cfg.resolve = cfg.resolve || {};
	const alias = (cfg.resolve && cfg.resolve.alias) || {};
	// Force a single React instance by resolving from the frontend root
	function resolveFromRoot(id) {
		try {
			const FRONTEND_ROOT = path.resolve(__dirname, '..', '..', '..'); // ../../../ -> frontend/
			return require.resolve(id, { paths: [FRONTEND_ROOT] });
		} catch (e) {
			return null;
		}
	}
	function resolveDirFromRoot(id) {
		const p = resolveFromRoot(id + '/package.json');
		return p ? path.dirname(p) : null;
	}
	const REACT_DIR = resolveDirFromRoot('react');
	const REACT_DOM_DIR = resolveDirFromRoot('react-dom');
	const JSX_RUNTIME = resolveFromRoot('react/jsx-runtime');
	const JSX_DEV_RUNTIME = resolveFromRoot('react/jsx-dev-runtime');
	const baseAlias = ALIAS_BASE;
	cfg.resolve.alias = {
		...alias,
		...(REACT_DIR ? { react: REACT_DIR } : {}),
		...(REACT_DOM_DIR ? { 'react-dom': REACT_DOM_DIR } : {}),
		...(JSX_RUNTIME ? { 'react/jsx-runtime$': JSX_RUNTIME } : {}),
		...(JSX_DEV_RUNTIME ? { 'react/jsx-dev-runtime$': JSX_DEV_RUNTIME } : {}),
		...(ALIAS_INDEX_FILE ? { 'volto-site-componentes$': ALIAS_INDEX_FILE } : {}),
		'volto-site-componentes': baseAlias,
		...(SRC_DIR ? { 'volto-site-componentes/src': SRC_DIR } : {}),
		...(SRC_INDEX ? { 'volto-site-componentes/src$': SRC_INDEX } : {}),
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
			const includesToAdd = [ALIAS_BASE, SRC_DIR].filter(Boolean);
			if (Array.isArray(rule.include)) {
				includesToAdd.forEach((p) => {
					if (!rule.include.includes(p)) rule.include.push(p);
				});
			} else if (rule.include) {
				rule.include = [rule.include, ...includesToAdd];
			} else {
				rule.include = [...includesToAdd];
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
		const includes = [ALIAS_BASE, SRC_DIR].filter(Boolean);
		if (Array.isArray(rule.include)) {
			includes.forEach((p) => {
				if (!rule.include.includes(p)) rule.include.push(p);
			});
		} else if (rule.include) {
			rule.include = [rule.include, ...includes];
		} else {
			rule.include = includes;
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

