module.exports = class Transformer {
  transformDefToVarLambda(exp) {
    const [_tag, name, params, body] = exp;
    return ["var", name, ["lambda", params, body]];
  }

  transformSwitchToIf(exp) {
    const [_tag, ...cases] = exp;

    const ifExp = ["if", null, null, null];

    let currentIf = ifExp;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCondition, currentBlock] = cases[i];

      currentIf[1] = currentCondition;
      currentIf[2] = currentBlock;

      const [nextCondition, nextBlock] = cases[i + 1];

      currentIf[3] = nextCondition === "else" ? nextBlock : ["if"];

      currentIf = currentIf[3];
    }

    return ifExp;
  }

  transformForToWhile(exp) {
    const [_tag, init, condition, modifier, body] = exp;

    const whileExp = [
      "begin",
      init,
      ["while", condition, ["begin", modifier, body]],
    ];

    return whileExp;
  }
};
