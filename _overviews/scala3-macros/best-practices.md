---
type: chapter
title: Best Practices
num: 8
---
## Inline

### Be careful when inlining for performance
To take the most advantage of the JVM JIT optimisations you want to avoid generating large methods.


## Macros
**Coming soon**


## Quoted code

### Keep quotes readable
* Try to avoid `${..}` with arbitrary expressions inside
  * Use `$someExpr`
  * Use `${ someExprFrom('localExpr) }`

To illustrate, consider the following example:
```scala
val x: StringContext = ...
'{ StringContext(${Varargs(stringContext.parts.map(Expr(_)))}: _*) }
```
Instead we can write the following:

```scala
val x: StringContext = ...
val partExprs = stringContext.parts.map(Expr(_))
val partsExpr = Varargs(partExprs)
'{ StringContext($partsExpr: _*) }
```
The contents of the quote are cleared this way.

### Avoid nested contexts

Consider the following code:

```scala
val y: Expr[Int] = ...
def body(x: Expr[Int])(using quotes.Nested) =  '{ $x + $y }
'{ (x: Int) => ${ body('x) } }
```

Instead, use a normal context and pass all needed expressions.
This has also the advantage of allowing the function to not be defined locally.
```scala
def body(x: Expr[Int], y: Expr[Int])(using Quotes) =
  '{ $x + $y }

val y: Expr[Int] = ...
'{ (x: Int) => ${ body('x, y) } }
```



## TASTy reflection
**Coming soon**
