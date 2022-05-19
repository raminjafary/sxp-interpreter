const Sxp = require("../src/sxp");
const Env = require("../src/env");

const tests = [
  require("./math-test"),
  require("./block-test"),
  require("./if-test"),
  require("./self-eval-test"),
  require("./var-test"),
  require("./while-test"),
];

const sxp = new Sxp(
  new Env({
    true: true,
    false: false,
  })
);

tests.forEach((t) => t(sxp));

console.log("All assertins are passed!");
