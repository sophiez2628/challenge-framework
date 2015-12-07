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

//check for rough structure - if statement inside of for loop

function analyzeCode(code) {
  var varDeclaration = false;
  var forLoop = false;
  var whileLoop = false;
  var ifStatement = false;

  var ast = esprima.parse(code);
  traverse(ast, function(node) {
    // check for for loop and a variable declaration
    if (node.kind === 'var') {
      varDeclaration = true;
    }
    if (node.type === 'ForStatement') {
      forLoop = true;
    }
    // check for while loop and if statement
    if (node.type === 'WhileStatement') {
      whileLoop = true;
    }

    if (node.type === 'IfStatement') {
      ifStatement = true;
    }

  });

  if (varDeclaration === false && forLoop === false) {
    console.log("This program MUST use a 'for loop' and a variable declaration.");
  } else if (varDeclaration === false) {
    console.log("This program MUST use a variable declaration.");
  } else if (forLoop === false) {
    console.log("This program MUST use a 'for loop'.");
  }
  
  if (whileLoop && ifStatement) {
    console.log("This program MUST NOT use a 'while loop' or an 'if statement'.");
  } else if (whileLoop) {
    console.log("This program MUST NOT use a 'while loop'.");
  } else if (ifStatement) {
    console.log("This program MUST NOT use an 'if statement'.");
  }

};
