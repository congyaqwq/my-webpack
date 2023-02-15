const fs = require('fs');
const path = require('path')
const parser = require('@babel/parser')
const options = require('..//webpack.config')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

const Parser = {
  getAst: path => {
    //  读取入口文件
    const content = fs.readFileSync(path, 'utf-8')
    //  将文件内容转为AST抽象语法树
    return parser.parse(content, {
      sourceType: 'module'
    })
  },
  getDependencies: (ast, filename) => {
    const dependencies = {}
    traverse(ast, {
      // import语句
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename)
        const filePath = './' + path.join(dirname, node.source.value)
        dependencies[node.source.value] = filePath
      }
    })
    return dependencies
  },
  getCode: ast => {
    // AST转换为code
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    return code
  }
}


class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options
    // 入口
    this.entry = entry
    // 出口
    this.output = output
    // 模块
    this.modules = []
  }
  // 构建启动
  run() {
    const info = this.build(this.entry)
    this.modules.push(info)
    this.modules.forEach(({ dependencies }) => {
      if (dependencies) {
        for (const dependency in dependencies) {
          this.modules.push(this.build(dependencies[dependency]))
        }
      }
    })
    const dependenciesGraph = this.modules.reduce((pre,cur)=>{
      pre[cur.filename] = {
        dependencies: cur.dependencies,
        code: cur.code
      }
      return pre
    }, {})
    console.log(this.modules,1)
    this.generate(dependenciesGraph)
  }
  build(filename) {
    const ast = Parser.getAst(filename)
    const dependencies = Parser.getDependencies(ast, filename)
    const code = Parser.getCode(ast)
    return { filename, dependencies, code }
  }
  // 重写 require函数,输出bundle
  generate(code) { 
    const filePath = path.join(this.output.path, this.output.filename)
    // 向下寻找依赖，再执行，再继续向下
    const bundle = `
    (function(graph) {
      function require(module){
        function loadRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {}
        ;(function(require, exports, code){
          eval(code)
        })(loadRequire, exports, graph[module].code)
        return exports
      }
      require('${this.entry}')
    })(${JSON.stringify(code)})
    `

    console.log(bundle,'bundle')
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}

new Compiler(options).run()