const assert = require("assert");

module.exports = function (sxp) {
  assert.strictEqual(
    sxp.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 25],
      ["if", [">", "x", 20], ["set", "y", 30], ["set", "y", 50]],
      "y",
    ]),
    50
  );
};
