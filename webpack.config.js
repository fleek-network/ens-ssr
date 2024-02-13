const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const fetch = require('node-fetch');

const out = path.resolve(__dirname, 'dist');
const filename = 'bundle.js';

class PreviewViaLocalNode {
  apply(compiler) {
    if (compiler.hooks && compiler.hooks.done) {
      compiler.hooks.done.tap('run-on-done', () => {
        const hash = execSync(`lightning-node dev store ${out}/${filename}`).toString().split('\t')[0];
        console.log('Bundle Hash: ' + hash);
        const addr = `http://localhost:4220/services/1/blake3/${hash}`;
        fetch(addr).then((res) => {
          res.text().then((text) => {
            console.log(`\nGET ${addr}`);
            console.log(`\n---------\n`);
            console.log(text);
            console.log(`\n---------\n`);
          })
        });
      });
    }
  };
}

module.exports = (env) => {
  return {
    entry: './src/index.js',
    mode: "none",
    output: {
      clean: true,
      path: out,
      filename,
      publicPath: '',
      iife: false,
      // Hack to bind the main function to the global scope
      library: { type: 'window' },
    },
    plugins: [env.WEBPACK_WATCH ? new PreviewViaLocalNode() : null],
    optimization: {
      usedExports: true,
    },
  }
};
