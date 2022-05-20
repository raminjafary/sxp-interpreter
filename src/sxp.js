const Env = require("./env");
const Transformer = require("./transformer");

module.exports = class Sxp {
  constructor(env = globalEnv) {
    this.globalEnv = env;
    this.transformer = new Transformer();
  }

  eval(exp, env = this.globalEnv) {
    // self-eval exp
    if (this.isNumber(exp)) {
      return exp;
    }

    if (this.isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === "begin") {
      const parentEnv = new Env({}, env);
      return this.evalBlock(exp, parentEnv);
    }

    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    if (this.isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === "if") {
      const [_tag, condition, consequsnt, alternate] = exp;

      if (this.eval(condition, env)) {
        return this.eval(consequsnt, env);
      }
      return this.eval(alternate, env);
    }

    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;

      let result = null;

      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;
      return {
        params,
        body,
        env,
      };
    }

    if (exp[0] === "def") {
      const [_tag, name, params, body] = exp;

      // const fn = {
      //   params,
      //   body,
      //   env,
      // };

      // return env.define(name, fn);

      //JIT-trasnpile to variable declaration!
      const varExp = this.transformer.transformDefToVarLambda(exp);

      return this.eval(varExp, env);
    }

    if (exp[0] === "switch") {
      const ifExp = this.transformer.transformSwitchToIf(exp);

      return this.eval(ifExp, env);
    }

    if (exp[0] === "for") {
      const whileExp = this.transformer.transformForToWhile(exp);

      return this.eval(whileExp, env);
    }

    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);

      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      if (typeof fn === "function") {
        return fn(...args);
      }

      const activationRecords = {};

      fn.params.forEach((param, index) => {
        activationRecords[param] = args[index];
      });

      const activationEnv = new Env(activationRecords, fn.env);

      return this.evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: "${JSON.stringify(exp)}"`;
  }

  evalBody(exp, env) {
    if (exp[0] === "begin") {
      return this.evalBlock(exp, env);
    }
    return this.eval(exp, env);
  }

  evalBlock(exp, env) {
    let result = null;

    const [_tag, ...expressions] = exp;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }

  isNumber(exp) {
    return typeof exp === "number";
  }

  isString(exp) {
    return (
      typeof exp === "string" &&
      (exp[0] === '"' || exp[0] === "'") &&
      (exp.slice(-1) === '"' || exp.slice(-1) === "'")
    );
  }

  isVariableName(exp) {
    return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
  }
};

const globalEnv = new Env({
  true: true,
  false: false,
  "+"(op1, op2) {
    return op1 + op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) return -op1;
    return op1 - op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
});
