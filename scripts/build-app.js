const fs = require('fs/promises');
const path = require('path');

const less = require('less');
const mustache = require('mustache');
const babel = require('@babel/core');
const {minimatch} = require('minimatch');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const outDir = path.join(rootDir, 'app');

// Mirror the original Gulp-based logger header behavior
// defined in tasks/compile.coffee.
const sourceMapHeader = "if (process.type === 'browser') { " +
  "try { require('source-map-support').install(); } catch(ignored) {} }";
const loggerHeader = [
  "var log = require('common/utils/logger').debugLogger(__filename);",
  "var logError = require('common/utils/logger').errorLogger(__filename, false);",
  "var logFatal = require('common/utils/logger').errorLogger(__filename, true);"
].join(' ');

let loggerIgnoreGlobs = null;

function shouldAddLoggerHeader (relativeJsPath) {
  if (!loggerIgnoreGlobs) {
    const ignorePath = path.join(srcDir, '.loggerignore');
    return fs.readFile(ignorePath, 'utf8')
      .then((txt) => {
        loggerIgnoreGlobs = txt
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => !!line && !line.startsWith('#'));
        return shouldAddLoggerHeader(relativeJsPath);
      })
      .catch(() => true);
  }

  const relUnix = relativeJsPath.replace(/\\/g, '/');
  for (const glob of loggerIgnoreGlobs) {
    if (minimatch(relUnix, glob)) {
      return false;
    }
  }
  return true;
}

async function main () {
  await rmrf(outDir);
  await ensureDir(outDir);

  const manifest = JSON.parse(await fs.readFile(path.join(srcDir, 'package.json'), 'utf8'));

  await copyDir(path.join(srcDir, 'themes'), path.join(outDir, 'themes'));
  await copyDir(path.join(srcDir, 'images'), path.join(outDir, 'images'));
  await copyDir(path.join(srcDir, 'dicts'), path.join(outDir, 'dicts'));

  await buildStyles();
  await buildHtml(manifest);
  await buildScripts();
  await copyNodeModules();
  await buildPackageJson();
}

async function buildStyles () {
  const inDir = path.join(srcDir, 'styles');
  const outStyles = path.join(outDir, 'styles');
  await ensureDir(outStyles);

  const lessFiles = await listFiles(inDir, (p) => p.endsWith('.less'));
  await Promise.all(lessFiles.map(async (filePath) => {
    const rel = path.relative(inDir, filePath);
    const cssRel = rel.replace(/\.less$/i, '.css');
    const outPath = path.join(outStyles, cssRel);
    await ensureDir(path.dirname(outPath));

    const input = await fs.readFile(filePath, 'utf8');
    const result = await less.render(input, {
      filename: filePath,
      paths: [path.dirname(filePath)]
    });
    await fs.writeFile(outPath, result.css, 'utf8');
  }));
}

async function buildHtml (manifest) {
  const inDir = path.join(srcDir, 'html');
  const outHtml = path.join(outDir, 'html');
  await ensureDir(outHtml);

  const htmlFiles = await listFiles(inDir, (p) => p.endsWith('.html'));
  await Promise.all(htmlFiles.map(async (filePath) => {
    const rel = path.relative(inDir, filePath);
    const outPath = path.join(outHtml, rel);
    await ensureDir(path.dirname(outPath));

    const input = await fs.readFile(filePath, 'utf8');
    const rendered = mustache.render(input, manifest);
    await fs.writeFile(outPath, rendered, 'utf8');
  }));
}

async function buildScripts () {
  const inDir = path.join(srcDir, 'scripts');
  const outScripts = path.join(outDir, 'scripts');
  await ensureDir(outScripts);

  const jsFiles = await listFiles(inDir, (p) => p.endsWith('.js'));
  if (!jsFiles.length) return;

  await Promise.all(jsFiles.map(async (filePath) => {
    const rel = path.relative(inDir, filePath);
    const outPath = path.join(outScripts, rel);
    await ensureDir(path.dirname(outPath));

    const result = await babel.transformFileAsync(filePath, {
      babelrc: false,
      configFile: false,
      sourceMaps: false,
      presets: [
        ['@babel/preset-env', {targets: {electron: '32'}}]
      ],
      plugins: [
        '@babel/plugin-proposal-function-bind'
      ]
    });

    if (!result || typeof result.code !== 'string') {
      throw new Error(`Failed to transpile ${filePath}`);
    }
    let code = result.code;
    // Prepend logger + source-map headers unless file is ignored,
    // matching the original Gulp pipeline semantics.
    if (await shouldAddLoggerHeader(rel)) {
      code = sourceMapHeader + '\n' + loggerHeader + '\n' + code;
    }
    await fs.writeFile(outPath, code, 'utf8');
  }));

  // Copy non-js assets that may be required at runtime
  const otherFiles = await listFiles(inDir, (p) => !p.endsWith('.js'));
  await Promise.all(otherFiles.map(async (filePath) => {
    const rel = path.relative(inDir, filePath);
    const outPath = path.join(outScripts, rel);
    await ensureDir(path.dirname(outPath));
    await fs.copyFile(filePath, outPath);
  }));
}

async function copyNodeModules () {
  const inDir = path.join(srcDir, 'node_modules');
  const outNodeModules = path.join(outDir, 'node_modules');
  await copyDir(inDir, outNodeModules, {
    shouldSkip: (rel) => {
      const r = rel.replace(/\\/g, '/');
      return (
        r.includes('/test/') ||
        r.includes('/tests/') ||
        r.includes('/example/') ||
        r.includes('/examples/') ||
        /\/(readme|changelog|notice)(\..*)?$/i.test(r)
      );
    }
  });
}

async function buildPackageJson () {
  const input = await fs.readFile(path.join(srcDir, 'package.json'), 'utf8');
  const rendered = mustache.render(input, process.env);
  await fs.writeFile(path.join(outDir, 'package.json'), rendered, 'utf8');
}

async function rmrf (p) {
  await fs.rm(p, {recursive: true, force: true});
}

async function ensureDir (p) {
  await fs.mkdir(p, {recursive: true});
}

async function copyDir (from, to, opts = {}) {
  const shouldSkip = opts.shouldSkip || (() => false);
  const entries = await fs.readdir(from, {withFileTypes: true});
  await ensureDir(to);
  await Promise.all(entries.map(async (ent) => {
    const srcPath = path.join(from, ent.name);
    const dstPath = path.join(to, ent.name);
    const rel = path.relative(from, srcPath);
    if (shouldSkip(rel)) return;
    if (ent.isDirectory()) {
      await copyDir(srcPath, dstPath, opts);
    } else if (ent.isFile()) {
      await fs.copyFile(srcPath, dstPath);
    }
  }));
}

async function listFiles (dir, predicate) {
  const out = [];
  async function walk (d) {
    const entries = await fs.readdir(d, {withFileTypes: true});
    for (const ent of entries) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) await walk(p);
      else if (ent.isFile() && predicate(p)) out.push(p);
    }
  }
  await walk(dir);
  return out;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

