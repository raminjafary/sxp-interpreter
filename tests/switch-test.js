const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
    (begin 
        (var i 5)

        (switch 
            ((> i 5) i)    
            ((< i 5) i)    
            (else 0)  
        )
    )
`,
    0
  );
};
