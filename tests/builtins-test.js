const assert = require("assert");
const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  assert.strictEqual(sxp.eval(["+", 5, 6]), 11);

  assert.strictEqual(sxp.eval(["+", ["+", 2, 6], 6]), 14);

  assert.strictEqual(sxp.eval([">", 5, 6]), false);

  assert.strictEqual(sxp.eval(["<", 5, 6]), true);

  sxpParser.test(
    sxp,
    `
        (+ 5 6)
    `,
    11
  );
};
