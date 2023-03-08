
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
    })({"../src/index.js":{"dependencies":{"./color.js":"./../src/color.js","./usage.js":"./../src/usage.js"},"code":"\"use strict\";\n\nvar _color = require(\"./color.js\");\nvar _usage = require(\"./usage.js\");\n(0, _usage.paint)(_color.red);"},"./../src/color.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.red = exports.blue = void 0;\nvar red = 'red';\nexports.red = red;\nvar blue = 'blue';\nexports.blue = blue;"},"./../src/usage.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.paint = paint;\nfunction paint(color) {\n  console.log(\"paint \".concat(color));\n}"}})
    