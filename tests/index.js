const Sxp = require("../src/sxp");

const tests = [
  require("./math-test"),
  require("./block-test"),
  require("./if-test"),
  require("./self-eval-test"),
  require("./var-test"),
  require("./while-test"),
  require("./builtins-test"),
  require("./functions-test"),
  require("./lambda-test"),
  require("./switch-test"),
  require("./for-test"),
  require("./class-test"),
  require("./module-test"),
  require("./import-test"),
];

const sxp = new Sxp();

tests.forEach((t) => t(sxp));

console.log("All assertins are passed!");
