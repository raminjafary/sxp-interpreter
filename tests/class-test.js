const sxpParser = require("./test-parser");

module.exports = function (sxp) {
  sxpParser.test(
    sxp,
    `
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
`,
    20
  );

  sxpParser.test(
    sxp,
    `
    (class Point null
        (begin 
            (def constructor (this x y)
                (begin 
                    (set (prop this x) x)    
                    (set (prop this y) y))) 
            (def calc (this)
                (+ (prop this x) (prop this y)))))
    
                (class Point3D Point
                    (begin 
                        (def constructor (this x y z)
                            (begin 
                                ((prop (super Point3D) constructor) this x y)
                                (set (prop this z) z))) 
                        (def calc (this)
                            (+  ((prop (super Point3D) calc) this) 
                                (prop this z)))))
        
                (var p (new Point3D 10 10 10))
                ((prop p calc) p)
`,
    30
  );
};
