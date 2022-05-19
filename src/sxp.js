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
            return this.eval(exp[1], env) + this.eval(exp[2], env)
        }

        // var
        if (exp[0] === 'var') {
            const [_, name, value] = exp
            return env.define(name, this.eval(value, env))
        }

        if (isVariableName(exp)) {
            return env.lookup(exp)
        }

        if (exp[0] === 'set') {
            const [_, name, value] = exp
            return env.assign(name, this.eval(value, env))
        }

        if (exp[0] === 'begin') {
            const parentEnv = new Env({}, env)
            return this.evalBlock(exp, parentEnv)
        }
    }

    evalBlock(exp, env) {
        let result = null

        const [_tag, ...expressions] = exp

        expressions.forEach(exp => {
            result = this.eval(exp, env)
        });

        return result
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

assert.strictEqual(sxp.eval(
    ['begin',
        ["var", "x", 10],
        "x"
    ]
), 10)

assert.strictEqual(sxp.eval(
    ['begin',
        ["var", "x", 10],
        ["begin",
            ["var", "x", 20],
            "x"
        ],
        "x"
    ]
), 10)

assert.strictEqual(sxp.eval(
    ['begin',
        ["var", "x", 10],
        ["var", "result", ["begin",
            ["var", "y", ["+", "x", 20]],
            "y"
        ]],
        "result"
    ]
), 30)


assert.strictEqual(sxp.eval(
    ['begin',
        ["var", "result", 10],
        ["begin",
            ['set', 'result', 20]
        ],
        "result"
    ]
), 20)

console.log("All assertins are passed!");