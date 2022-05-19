const assert = require("assert");

module.exports = function (sxp) {
  assert.strictEqual(sxp.eval(["var", "x", 14]), 14);
  assert.strictEqual(sxp.eval("x"), 14);
  assert.strictEqual(sxp.eval(["var", "y", "true"]), true);
  assert.strictEqual(sxp.eval("y"), true);
};
