const assert = require("assert");
const sxpParser = require("../src/parser/sxpParser");

function test(sxp, code, expected) {
  const exp = sxpParser.parse(`(begin ${code})`);
  assert.strictEqual(sxp.evalGlobal(exp), expected);
}

module.exports = {
  test,
};
