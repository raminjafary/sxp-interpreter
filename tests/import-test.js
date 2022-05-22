const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
     (import Math)

     ((prop Math abs) (- 10))
`,
    10
  );

  sxpParser.test(
    sxp,
    `
    (var abs (prop Math abs))
    (abs (- 10))
`,
    10
  );
};
