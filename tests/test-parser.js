const assert = require("assert");
const sxpParser = require("../parser/sxpParser");

function test(sxp, code, expected) {
  const exp = sxpParser.parse(code);
  assert.strictEqual(sxp.eval(exp), expected);
}

module.exports = {
  test,
};
