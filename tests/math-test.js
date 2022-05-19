const assert = require("assert");
const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  assert.strictEqual(sxp.eval(["+", 5, 6]), 11);

  assert.strictEqual(sxp.eval(["+", ["+", 2, 6], 6]), 14);

  sxpParser.test(
    sxp,
    `
    (+ 5 6)
`,
    11
  );
};
