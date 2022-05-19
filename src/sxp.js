const Env = require("./env");

module.exports = class Sxp {
  constructor(env = new Env()) {
    this.env = env;
  }

  eval(exp, env = this.env) {
    // self-eval exp
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // math exp
    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    // comparasion operators
    if (exp[0] === ">") {
      return this.eval(exp[1], env) > this.eval(exp[2], env);
    }

    if (exp[0] === "<") {
      return this.eval(exp[1], env) < this.eval(exp[2], env);
    }

    // var
    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    if (exp[0] === "begin") {
      const parentEnv = new Env({}, env);
      return this.evalBlock(exp, parentEnv);
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

    throw `Unimplemented: "${JSON.stringify(exp)}"`;
  }

  evalBlock(exp, env) {
    let result = null;

    const [_tag, ...expressions] = exp;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }
};

function isNumber(exp) {
  return typeof exp === "number";
}

function isString(exp) {
  return (
    typeof exp === "string" &&
    (exp[0] === '"' || exp[0] === "'") &&
    (exp.slice(-1) === '"' || exp.slice(-1) === "'")
  );
}

function isVariableName(exp) {
  return typeof exp === "string" && /^[a-zA-Z][0-9a-zA-z_]*$/.test(exp);
}
