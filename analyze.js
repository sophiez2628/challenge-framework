function traverse(node, func) {
  func(node);
  var keys = Object.getOwnPropertyNames(node);
  for (var i = 0; i < keys.length; i++) {
    var child = node[keys[i]];
    if (typeof child === 'object' && child !== null) {

      if (Array.isArray(child)) {
        child.forEach(function(node) {
          traverse(node, func);
        });
      } else {
        traverse(child, func);
      }
    }
  }
};

function analyzeCode(code) {
  var ast = esprima.parse(code);
  traverse(ast, function(node) {
    console.log(node.type);
  });
};

function processResults(results) {

};
