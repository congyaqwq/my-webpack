
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
      require('../src/index.js')
    })({"../src/index.js":{"dependencies":{"./testRequire.js":"./../src/testRequire.js"},"code":"\"use strict\";\n\nvar _testRequire = require(\"./testRequire.js\");"},"./../src/testRequire.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.red = void 0;\nvar red = 'red';\nexports.red = red;"}})
    