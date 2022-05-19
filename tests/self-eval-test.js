const assert = require("assert");

module.exports = function (sxp) {
  assert.strictEqual(sxp.eval(1), 1);
  assert.strictEqual(sxp.eval('"hi"'), "hi");
};
