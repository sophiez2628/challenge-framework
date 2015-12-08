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

function processResults(results) {
  if (results["varDeclaration"] === false && results["forLoop"] === false) {
    console.log("This program MUST use a 'for loop' and a variable declaration.");
  } else if (results["varDeclaration"] === false) {
    console.log("This program MUST use a variable declaration.");
  } else if (results["forLoop"] === false) {
    console.log("This program MUST use a 'for loop'.");
  }

  if (results["whileLoop"] && results["ifStatement"]) {
    console.log("This program MUST NOT use a 'while loop' or an 'if statement'.");
  } else if (results["whileLoop"]) {
    console.log("This program MUST NOT use a 'while loop'.");
  } else if (results["ifStatement"]) {
    console.log("This program MUST NOT use an 'if statement'.");
  }

  if (results["ifStatementInsideLoop"] === false) {
    console.log("There should be a 'for loop' with an 'if statement' inside of it");
  }
};

function analyzeCode(code) {
  var varDeclaration = false;
  var forLoop = false;
  var whileLoop = false;
  var ifStatement = false;
  var ifStatementInsideLoop = false;

  var ast = esprima.parse(code);
  traverse(ast, function(node) {
    // check for for loop and a variable declaration
    if (node.kind === 'var') {
      varDeclaration = true;
    }
    if (node.type === 'ForStatement') {
      forLoop = true;
      //check for rough structure - if statement inside of for loop
      traverse(node, function(node) {
        if (node.type === 'IfStatement') {
          ifStatementInsideLoop = true;
        }
      });
    }
    // check for while loop and if statement
    if (node.type === 'WhileStatement') {
      whileLoop = true;
    }

    if (node.type === 'IfStatement') {
      ifStatement = true;
    }

  });

  processResults({"varDeclaration": varDeclaration,
                  "forLoop": forLoop,
                  "whileLoop": whileLoop,
                  "ifStatement": ifStatement,
                  "ifStatementInsideLoop": ifStatementInsideLoop})

};
