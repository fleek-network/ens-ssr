const path = require('path');
const fs = require('fs');

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

module.exports = {
  entry: './src/index.js',
  mode: "none",
  plugins: [
    new DoneHook(() => {
      fs.appendFileSync(out + '/' + filename, "const main = __webpack_exports__.main;")
    })
  ],
  output: {
    path: out,
    filename,
    publicPath: '',
    iife: false,
  },
};
