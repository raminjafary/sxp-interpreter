const assert = require("assert");

module.exports = function (sxp) {
  assert.strictEqual(sxp.eval(["begin", ["var", "x", 10], "x"]), 10);

  assert.strictEqual(
    sxp.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 20], "x"],
      "x",
    ]),
    10
  );

  assert.strictEqual(
    sxp.eval([
      "begin",
      ["var", "x", 10],
      ["var", "result", ["begin", ["var", "y", ["+", "x", 20]], "y"]],
      "result",
    ]),
    30
  );

  assert.strictEqual(
    sxp.eval([
      "begin",
      ["var", "result", 10],
      ["begin", ["set", "result", 20]],
      "result",
    ]),
    20
  );
};
