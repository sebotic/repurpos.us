import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

class RollupNG2 {
  constructor(options){
    this.options = options;
  }
  resolveId(id, from){
    if (id.startsWith('rxjs/')){
      return `${__dirname}/node_modules/rxjs/${id.replace('rxjs/', '')}.js`;
    }
  }
}

const rollupNG2 = (config) => new RollupNG2(config);

export default {
  entry: 'dist/out-tsc/main.js',
  sourceMap: true,
  moduleName: 'main',
  plugins: [
    rollupNG2(),
    nodeResolve({
      jsnext: true, main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};