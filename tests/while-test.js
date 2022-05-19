const assert = require("assert");

module.exports = function (sxp) {
  assert.strictEqual(
    sxp.eval([
      "begin",
      ["var", "counter", 10],
      ["var", "i", 0],
      [
        "while",
        ["<", "i", 20],
        [
          "begin",
          ["set", "counter", ["+", "counter", 1]],
          ["set", "i", ["+", "counter", 1]],
        ],
      ],
      "i",
    ]),
    20
  );
};
