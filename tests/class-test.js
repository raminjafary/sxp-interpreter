const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
    (begin 
       (class Point null
            (begin 
                (def constructor (this x y)
                    (begin 
                        (set (prop this x) x)    
                        (set (prop this y) y)    
                    )
                ) 
                (def calc (this)
                    (+ (prop this x) (prop this y))
                )
                
            )
        
        )
        (var p (new Point 10 10))
        ((prop p calc) p)
    )
`,
    20
  );
};
