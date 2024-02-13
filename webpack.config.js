const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const fetch = require('node-fetch');

const out = path.resolve(__dirname, 'dist');
const filename = 'bundle.js';

class DoneHook {
  constructor(cb) {
    this.apply = function(compiler) {
      if (compiler.hooks && compiler.hooks.done) {
        compiler.hooks.done.tap('done-hook', cb);
      }
    };
  }
}

module.exports = (env) => {
  return {
    entry: './src/index.js',
    mode: "none",
    output: {
      path: out,
      filename,
      publicPath: '',
      iife: false,
    },
    plugins: [
      new DoneHook(() => {
        // Hack to expose the main function to the global scope
        fs.appendFileSync(out + '/' + filename, "const main = __webpack_exports__.main;")
        if (env.WEBPACK_WATCH) {
          const hash = execSync(`lightning-node dev store ${out}/${filename}`).toString().split('\t')[0];
          console.log('Bundle Hash: ' + hash);

          fetch(`http://localhost:4220/services/1/blake3/${hash}`).then((res) => {
            res.text().then((text) => {
              console.log('---------\n\n' + text + '\n\n---------');
            })
          });
        }
      }),
    ]
  }
};
