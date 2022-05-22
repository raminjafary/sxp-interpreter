const fs = require("fs");
const Env = require("./env");
const sxpParser = require("./parser/sxpParser");
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
      const [_, ref, value] = exp;

      if (ref[0] === "prop") {
        const [_tag, instance, propName] = ref;

        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }

      return env.assign(ref, this.eval(value, env));
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

    if (exp[0] === "import") {
      const [_tag, name] = exp;

      const module = fs.readFileSync(
        `${__dirname}/modules/${name}.sxp`,
        "utf-8"
      );

      const body = sxpParser.parse(`(begin ${module})`);

      const moduleExp = ["module", name, body];

      return this.eval(moduleExp, env);
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
      // const [_tag, name, params, body] = exp;

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

    if (exp[0] === "class") {
      const [_tag, name, parent, body] = exp;

      const parentEnv = this.eval(parent, env) || env;
      const classEnv = new Env({}, parentEnv);

      this.evalBody(body, classEnv);

      return env.define(name, classEnv);
    }

    if (exp[0] === "module") {
      const [_tag, name, body] = exp;

      const moduleEnv = new Env({}, env);

      this.evalBody(body, moduleEnv);

      return env.define(name, moduleEnv);
    }

    if (exp[0] === "new") {
      const classEnv = this.eval(exp[1], env);

      const instanceEnv = new Env({}, classEnv);

      const args = exp.slice(2).map((arg) => this.eval(arg, env));

      this.callDefinedFunction(classEnv.lookup("constructor"), [
        instanceEnv,
        ...args,
      ]);

      return instanceEnv;
    }

    if (exp[0] === "super") {
      const [_tag, className] = exp;
      return this.eval(className, env).parent;
    }

    if (exp[0] === "prop") {
      const [_tag, instance, name] = exp;

      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
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
      return this.callDefinedFunction(fn, args);
    }

    throw `Unimplemented: "${JSON.stringify(exp)}"`;
  }

  callDefinedFunction(fn, args) {
    const activationRecords = {};

    fn.params.forEach((param, index) => {
      activationRecords[param] = args[index];
    });

    const activationEnv = new Env(activationRecords, fn.env);

    return this.evalBody(fn.body, activationEnv);
  }

  evalGlobal(exp) {
    return this.evalBody(exp, this.globalEnv);
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
  null: null,
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
