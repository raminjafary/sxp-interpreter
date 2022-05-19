const assert = require('assert')
const Env = require('./env')

class Sxp {

    constructor(env = new Env()) {
        this.env = env
    }

    eval(exp, env = this.env) {

        // self-evaluating exp

        if (isNumber(exp)) {
            return exp
        }


        if (isString(exp)) {
            return exp.slice(1, -1)
        }

        // math exp
        if (exp[0] === '+') {
            return this.eval(exp[1]) + this.eval(exp[2])
        }


        // var
        if (exp[0] === 'var') {
            const [_, name, value] = exp
            return env.define(name, this.eval(value))
        }

        if (isVariableName(exp)) {
            return env.lookup(exp)
        }
    }
}


function isNumber(exp) {
    return typeof exp === 'number'
}

function isString(exp) {
    return typeof exp === 'string' && (exp[0] === '"' || exp[0] === "'") && (exp.slice(-1) === '"' || exp.slice(-1) === "'")
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][0-9a-zA-z_]*$/.test(exp)
}


const sxp = new Sxp(new Env({
    true: true,
    false: false
}))

assert.strictEqual(sxp.eval(1), 1)
assert.strictEqual(sxp.eval('"hi"'), 'hi')

assert.strictEqual(sxp.eval(["+", 5, 6]), 11)
assert.strictEqual(sxp.eval(["+", ["+", 2, 6], 6]), 14)

assert.strictEqual(sxp.eval(["var", "x", 14]), 14)
assert.strictEqual(sxp.eval("x"), 14)
assert.strictEqual(sxp.eval(["var", "y", 'true']), true)
assert.strictEqual(sxp.eval("y"), true)

console.log("All assertins are passed!");