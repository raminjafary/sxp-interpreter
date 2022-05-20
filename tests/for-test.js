const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
    (for 
        (var x 10)    
        (> x 0)    
        (set x (- x 1))
        x
    )
`,
    0
  );
};
