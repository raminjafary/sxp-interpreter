const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
    (begin 
        (def square (callback)
            (begin 
                (var x 10)
                (var y 10)
                (callback  (* x y))
            )
        )
        (square (lambda (data) (+ data 10)))
    )
`,
    110
  );

  sxpParser.test(
    sxp,
    `
     ((lambda (data) (+ data 10)) 10)
`,
    20
  );

  sxpParser.test(
    sxp,
    `
     (begin 
        (var result (lambda (data) (+ data 10)))
        (result 10)    
    )
`,
    20
  );
};
