const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
    (begin 
        (def square (x)
            (* x x)
        )
        
        (square 5)
    )
`,
    25
  );

  sxpParser.test(
    sxp,
    `
    (begin 
        (def add (x y)
            (begin
                (var z 10)
                (+ (+ x y) z)    
            )
        )
        
        (add 5 5)
    )
`,
    20
  );

  sxpParser.test(
    sxp,
    `
    (begin 
        (var val 5)
        (def add (x)
            (begin
                (var z (+ x val))
                (def closure (y)
                    (+  y z)
                )
                closure
            )
        )
        
        (var fn (add 5))
        (fn 5)
    )
`,
    15
  );
};
