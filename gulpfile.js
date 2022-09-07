const { src, dest, parallel } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const rollup = require('rollup');
const replace = require('@rollup/plugin-replace');
const path = require('path');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const { terser } = require("rollup-plugin-terser");
const rollupTypescript = require('rollup-plugin-typescript2');

const builds = {
    'umd': {
        file: 'dist/index.js',
        format: 'umd',
        name: 'ProEventBus',
        env: 'development'
    },
    'esm': {
        file: 'dist/index.esm.js',
        format: 'esm'
    }
};

function genConfig(name) {
    const opts = builds[name];
    const config = {
        inputOptions: {
            input: path.join(process.cwd(), '/src/index.ts'),
            plugins: [
                nodeResolve(),
                commonjs()
            ]
        },
        outputOptionsList: [
            {
                file: opts.file,
                format: opts.format,
                name: opts.name || '$ProEventBus',
            }
        ]
    };

    const vars = {
        __DEV__: `process.env.NODE_ENV !== 'production'`,
        preventAssignment: true
    };
    if (opts.env) {
        vars['process.env.NODE_ENV'] = JSON.stringify(opts.env);
        vars.__DEV__ = opts.env !== 'production';
        config.inputOptions.plugins.push(rollupTypescript({
            tsconfigOverride: {
                compilerOptions: {
                    target: 'es5'
                }
            }
        }));
    } else {
        config.inputOptions.plugins.push(rollupTypescript());
        config.inputOptions.plugins.push(getBabelOutputPlugin({
            allowAllFormats: true,
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-runtime', {
                "corejs": 3
            }]]
        }));
    }

    config.inputOptions.plugins.push(replace(vars));
    config.inputOptions.plugins.push(terser());
    return config;
}

const clean = async function clean() {
    const { deleteSync } = await import('del');
    return deleteSync(['dist']);
};

const style = function style() {
    return src('src/**/*.css')
        .pipe(cleanCSS())
        .pipe(dest('dist'));
};

async function buildScript(rollupConfig) {
    let bundle;
    try {
        bundle = await rollup.rollup(rollupConfig.inputOptions);
        await generateOutputs(bundle, rollupConfig.outputOptionsList);
    } catch (error) {
        console.error(error);
    }
    if (bundle) {
        await bundle.close();
    }
}

async function generateOutputs(bundle, outputOptionsList) {
    for (const outputOptions of outputOptionsList) {
        await bundle.write(outputOptions);
    }
}

async function buildAllScript() {
    const keys = Object.keys(builds);
    for (let i = 0, len = keys.length; i < len; i++) {
        const name = keys[i];
        const config = genConfig(name);
        await buildScript(config);
    }
}

// const build = series(clean, parallel(style, buildScript))
const build = parallel(style, buildAllScript);

// watch(['src/**/*'], build)

module.exports = {
    clean,
    build
};